package com.point.blood.bloodRequest.RequestApproval;

import com.point.blood.BloodRequestStatus.BloodRequestStatusRepository;
import com.point.blood.bloodRequest.BloodRequest;
import com.point.blood.bloodRequest.BloodRequestRepository;
import com.point.blood.shared.EditResult;
import com.point.blood.shared.MessageDTO;
import com.point.blood.stock.BloodStockRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class BloodRequestApprovalService {
    private final BloodRequestRepository requestRepository;
    private final BloodStockRepository stockRepository;
    private final BloodRequestStatusRepository statusRepository;

    public EditResult<Void> acceptRequest(Long requestId, Long pointId) {
        var req = requestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Nie znaleziono zgłoszenia."));

        var btId = req.getBloodType().getId();
        //TODO czy to powinein byc throw error czy blad na froncie?
        var stock = stockRepository.findForUpdate(pointId, btId)
                .orElseThrow(() -> new IllegalStateException(
                        "W magazynie punktu brak pozycji dla tej grupy krwi."));

        var needed = req.getAmount();
        if (needed == null || needed.signum() <= 0) {
            return EditResult.<Void>builder()
                    .messages(List.of(MessageDTO.createErrorMessage(
                           "Nieprawidłowa ilość w zgłoszeniu.")))
                    .resultDTO(null)
                    .build();
        }

        if (stock.getAvailableQuantity().compareTo(needed) < 0) {
            return EditResult.<Void>builder()
                    .messages(List.of(MessageDTO.createErrorMessage(
                            "Za mało krwi w magazynie, nie można zrealizować zgłoszenia.")))
                    .resultDTO(null)
                    .build();
        }

        stock.setAvailableQuantity(stock.getAvailableQuantity().subtract(needed));
        stockRepository.save(stock);

        var approved = statusRepository.findByTypeIgnoreCase("ZREALIZOWANA")
                .orElseThrow(() -> new IllegalStateException("Brak statusu ZREALIZOWANA."));
        req.setStatus(approved);
        requestRepository.save(req);

        return EditResult.<Void>builder()
                .messages(List.of(MessageDTO.createSuccessMessage(
                        "Zgłoszenie zrealizowane, stan magazynu został pomniejszony")))
                .resultDTO(null)
                .build();
    }
}
