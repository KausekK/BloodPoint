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
        if (req.getBloodTypeId() == null) {
            throw new IllegalArgumentException("Brak identyfikatora typu krwi.");
        }
        if (req.getLiters() == null || req.getLiters().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Ilość musi być dodatnia.");
        }

        BloodType bloodType = bloodTypeRepository.findById(req.getBloodTypeId())
                .orElseThrow(() -> new IllegalArgumentException("Nieznany typ krwi (id=" + req.getBloodTypeId() + ")."));

        BloodDonationPoint point = donationPointRepository.findById(pointId)
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
                bloodType.getId(),
                bloodType.getBloodGroup() + " Rh" + bloodType.getRhFactor(),
                available,
                reserved,
                free
        );
    }
}
