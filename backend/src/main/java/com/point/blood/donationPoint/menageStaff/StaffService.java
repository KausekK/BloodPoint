package com.point.blood.donationPoint.menageStaff;

import com.point.blood.donationPoint.BloodDonationPointRepository;
import com.point.blood.shared.EditResult;
import com.point.blood.shared.MessageDTO;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class StaffService {

    private final StaffRepository staffRepository;
    private final BloodDonationPointRepository bloodDonationPointRepository;
    private final StaffMapper staffMapper;

    public EditResult<Void> deleteEmployee(Long employeeId) {
        if (!staffRepository.existsById(employeeId)) {
            return EditResult.<Void>builder()
                    .messages(List.of(MessageDTO.createErrorMessage(
                            "Pracownik o id %d nie istnieje.".formatted(employeeId))))
                    .resultDTO(null)
                    .build();
        }

        staffRepository.deleteById(employeeId);

        return EditResult.<Void>builder()
                .messages(List.of(MessageDTO.createSuccessMessage("Pracownik został usunięty.")))
                .resultDTO(null)
                .build();
    }

    public EditResult<StaffDTO> editEmployee(Long staffId, StaffUpdateDTO req) {
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Pracownik o id %d nie istnieje.".formatted(staffId)));

        List<String> errors = validate(req);
        if (!errors.isEmpty()) {
            return EditResult.<StaffDTO>builder()
                    .messages(errors.stream().map(MessageDTO::createErrorMessage).toList())
                    .resultDTO(null)
                    .build();
        }

        if (req.getEmploymentStartDay() != null) {
            staff.setEmploymentStartDay(req.getEmploymentStartDay());
        }
        if (req.getPosition() != null) {
            staff.setPosition(req.getPosition());
        }
        if (req.getBloodDonationPointId() != null) {
            staff.setBloodDonationPoint(
                    bloodDonationPointRepository.getReferenceById(req.getBloodDonationPointId()));
        }

        StaffDTO dto = staffMapper.toDto(staff);

        return EditResult.<StaffDTO>builder()
                .messages(List.of(MessageDTO.createSuccessMessage("Dane pracownika zostały zaktualizowane.")))
                .resultDTO(dto)
                .build();
    }

    private List<String> validate(StaffUpdateDTO req) {
        List<String> errors = new ArrayList<>();
        if (req.getEmploymentStartDay() != null && req.getEmploymentStartDay().isAfter(LocalDate.now())) {
            errors.add("Data zatrudnienia nie może być w przyszłości.");
        }
        return errors;
    }
}
