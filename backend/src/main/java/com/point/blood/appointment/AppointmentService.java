package com.point.blood.appointment;

import com.point.blood.donationTimeSlot.DonationTimeSlot;
import com.point.blood.donationTimeSlot.DonationTimeSlotRepository;
import com.point.blood.shared.EditResult;
import com.point.blood.shared.MessageDTO;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DonationTimeSlotRepository timeSlotRepository;
    private final AppointmentMapper appointmentMapper;
    private final DonationTimeSlotRepository donationTimeSlotRepository;


    private Boolean validateAppointment(AppointmentDTO dto) {
        return appointmentRepository.existsByUsers_Id(dto.getUserId());
    }

    public EditResult<AppointmentDTO> insertAppointment(AppointmentDTO dto) {

        if (validateAppointment(dto)) {
            return buildError("Masz już wcześniej umówioną wizytę, odwołaj ją aby umówić nową.");
        }

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

    public EditResult<AppointmentDTO> deleteAppointment(Long appointmentId) {
        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new EntityNotFoundException("Nie znaleziono wizyty"));

        DonationTimeSlot slot = appt.getDonationTimeSlot();
        slot.setAvailableSlot(true);
        donationTimeSlotRepository.saveAndFlush(slot);

        appointmentRepository.delete(appt);



        return EditResult.<AppointmentDTO>builder()
                .messages(List.of(MessageDTO.createSuccessMessage("Wizyta została odwołana")))
                .build();
    }

    public Optional<ScheduledAppointmentForUserDTO> getScheduledAppointmentForUser(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        return appointmentRepository.findScheduledAppointmentForUserByUserId(userId, now);
    }

    public List<AllAppointmentsDetailsDTO> getAllAppointmentsForBloodPoint(Long bloodDonationPointId) {
        LocalDateTime today = LocalDate.now().atStartOfDay();
        LocalDateTime tomorrow = today.plusDays(1);

        return appointmentRepository.findAllTodayAppointmentsForBloodPoint(
                bloodDonationPointId, today, tomorrow);
    }

    private EditResult<AppointmentDTO> buildError(String msg) {
        return EditResult.<AppointmentDTO>builder()
                .messages(List.of(MessageDTO.createErrorMessage(msg)))
                .build();
    }


}
