package com.point.blood.stock;

import com.point.blood.bloodType.BloodType;
import com.point.blood.bloodType.BloodTypeRepository;
import com.point.blood.donationPoint.BloodDonationPoint;
import com.point.blood.donationPoint.BloodDonationPointRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BloodStockService {

    private final BloodStockRepository bloodStockRepository;
    private final BloodTypeRepository bloodTypeRepository;
    private final BloodDonationPointRepository donationPointRepository;

    public List<BloodStockDTO> getBloodStock() {
        return bloodStockRepository.findTotalStockByBloodType();
    }

    public List<BloodStockDTO> getBloodStockByBloodDonationPointId(Long pointId) {
        return bloodStockRepository.findStockByPointId(pointId);
    }

    @Transactional
    public BloodStockDTO registerDelivery(Long pointId, RegisterDeliveryRequest req) {
        if (req.getBloodGroup() == null || req.getBloodGroup().isBlank()) {
            throw new IllegalArgumentException("Brak grupy krwi.");
        }
        if (req.getLiters() == null || req.getLiters().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Ilość musi być dodatnia.");
        }

        var parsed = parseBloodGroupLabelToChar(req.getBloodGroup());

        BloodType bloodType = bloodTypeRepository
                .findByBloodGroupAndRhFactor(parsed.group(), parsed.rh())
                .orElseThrow(() -> new IllegalArgumentException("Nieznany typ krwi: " + req.getBloodGroup()));

        BloodDonationPoint point = donationPointRepository
                .findById(pointId)
                .orElseThrow(() -> new IllegalArgumentException("Nie znaleziono punktu o id=" + pointId));

        int litersInt = req.getLiters().setScale(0, RoundingMode.HALF_UP).intValueExact();

        BloodPointBloodTyp row = bloodStockRepository
                .findByDonationPointIdAndBloodTypeId(point.getId(), bloodType.getId())
                .orElse(BloodPointBloodTyp.builder()
                        .availableQuantity(0)
                        .reservedQuantity(0)
                        .donationPoint(point)
                        .bloodType(bloodType)
                        .build()
                );

        row.setAvailableQuantity(row.getAvailableQuantity() + litersInt);
        bloodStockRepository.save(row);

        long available = row.getAvailableQuantity();
        long reserved = row.getReservedQuantity();
        long free = available - reserved;

        return new BloodStockDTO(
                row.getBloodType().getBloodGroup() + row.getBloodType().getRhFactor(),
                available,
                reserved,
                free
        );
    }

    private static ParsedBloodC parseBloodGroupLabelToChar(String label) {
        String s = label.trim().replace(" ", "");   // "ARh+", "0Rh-", "AB+"
        String group;
        String rhs;

        if (s.startsWith("AB")) {
            group = "AB";
            rhs = s.substring(2);
        } else {
            group = s.substring(0, 1);
            rhs = s.substring(1);
        }

        rhs = rhs.replace("RH", "Rh");

        if (rhs.equals("+") || rhs.equals("Rh+")) return new ParsedBloodC(group, '+');
        if (rhs.equals("-") || rhs.equals("Rh-")) return new ParsedBloodC(group, '-');

        throw new IllegalArgumentException("Nieprawidłowy format grupy krwi: " + label);
    }

    private record ParsedBloodC(String group, Character rh) {}


}
