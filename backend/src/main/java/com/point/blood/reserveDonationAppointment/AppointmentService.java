package com.point.blood.reserveDonationAppointment;

import com.point.blood.shared.EditResult;
import com.point.blood.shared.MessageDTO;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class AppointmentService {

    private final IAppointmentRepository appointmentRepository;
    private final IDonationTimeSlotRepository timeSlotRepository;
    private final AppointmentMapper appointmentMapper;


    public EditResult<AppointmentDTO> insertAppointment(AppointmentDTO dto) {

        try {
            DonationTimeSlot slot = timeSlotRepository.getReferenceById(dto.getSlotId());

            if (!slot.isAvailableSlot()) {
                return buildError("Termin jest już zajęty.");
            }

            slot.setAvailableSlot(false);

            Appointment entity = appointmentMapper.toEntity(dto);
            entity.setDonationTimeSlot(slot);

            Appointment saved = appointmentRepository.save(entity);

            return EditResult.<AppointmentDTO>builder()
                    .resultDTO(appointmentMapper.toDto(saved))
                    .messages(List.of(MessageDTO.createSuccessMessage("Umówiono wizytę")))
                    .build();

        } catch (ObjectOptimisticLockingFailureException e) {
            return buildError("Termin jest już zajęty. Wybierz inny.");
        }
    }

    private EditResult<AppointmentDTO> buildError(String msg) {
        return EditResult.<AppointmentDTO>builder()
                .messages(List.of(MessageDTO.createErrorMessage(msg)))
                .build();
    }
}
