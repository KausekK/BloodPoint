package com.point.blood.donationPoint;

import com.point.blood.appointment.AppointmentDTO;
import com.point.blood.shared.EditResult;
import com.point.blood.shared.MessageDTO;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class BloodPointService {

    private final BloodDonationPointRepository bloodDonationPointRepository;

    public EditResult<BloodDonationPoint> editOpenHours(Long id, double openHour, double closeHour) {

        var validationError = validateHours(openHour, closeHour);
        if (validationError.isPresent()) {
            return buildError(validationError.get());
        }

        return bloodDonationPointRepository.findById(id)
                .map(point -> {
                    point.setOpenHour(openHour);
                    point.setCloseHour(closeHour);
                    return EditResult.<BloodDonationPoint>builder()
                            .messages(List.of(MessageDTO.createSuccessMessage("Godziny otwarcia zostały zmienione.")))
                            .build();
                })
                .orElseGet(() -> buildError("Punkt o podanym id nie istnieje."));
    }

    private Optional<String> validateHours(double openHour, double closeHour) {
        if (openHour < 0 || closeHour < 0) {
            return Optional.of("Godziny muszą być dodatnie (≥ 0).");
        }
        if (openHour > 24 || closeHour > 24) {
            return Optional.of("Podaj wartości w zakresie 0–24.");
        }
        if (openHour == closeHour) {
            return Optional.of("Godzina otwarcia i zamknięcia nie mogą być takie same.");
        }
        if (openHour > closeHour) {
            return Optional.of(String.format(
                    "Godzina otwarcia (%.2f) musi być wcześniejsza niż godzina zamknięcia (%.2f).",
                    openHour, closeHour));
        }
        return Optional.empty();
    }

    private EditResult<BloodDonationPoint> buildError(String msg) {
        return EditResult.<BloodDonationPoint>builder()
                .messages(List.of(MessageDTO.createErrorMessage(msg)))
                .build();
    }
}
