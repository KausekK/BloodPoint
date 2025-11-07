package com.point.blood.bloodRequest.RequestApproval;

import com.point.blood.BloodRequestStatus.BloodRequestStatusRepository;
import com.point.blood.bloodRequest.BloodRequestRepository;
import com.point.blood.stock.BloodStockRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class BloodRequestApprovalService {
    private final BloodRequestRepository requestRepository;
    private final BloodStockRepository stockRepository;
    private final BloodRequestStatusRepository statusRepository;

    public void acceptRequest(Long requestId, Long pointId) {
        var req = requestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Nie znaleziono zgłoszenia."));


        var btId = req.getBloodType().getId();
        var stock = stockRepository.findForUpdate(pointId, btId)
                .orElseThrow(() -> new IllegalStateException(
                        "W magazynie punktu brak pozycji dla tej grupy krwi."));

        var needed = req.getAmount();
        if (needed == null || needed.signum() <= 0) {
            throw new IllegalStateException("Nieprawidłowa ilość w zgłoszeniu.");
        }

        if (stock.getAvailableQuantity().compareTo(needed) < 0) {
            throw new IllegalStateException("Za mało krwi w magazynie, nie można zrealizować zgłoszenia.");
        }

        stock.setAvailableQuantity(stock.getAvailableQuantity().subtract(needed));
        stockRepository.save(stock);

        var approved = statusRepository.findByTypeIgnoreCase("ZREALIZOWANA")
                .orElseThrow(() -> new IllegalStateException("Brak statusu ZREALIZOWANA."));
        req.setStatus(approved);
        requestRepository.save(req);
    }
}
