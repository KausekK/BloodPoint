package com.point.blood.reserveDonationAppointment;

import com.point.blood.menageUser.User;
import com.point.blood.shared.EntityMapper;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class AppointmentMapper implements EntityMapper<AppointmentDTO, Appointment> {

    @Override
    public Appointment toEntity(AppointmentDTO dto) {
        return Appointment.builder()
                .status(AppointmentStatusEnum.SCHEDULED)
                .createdAt(LocalDateTime.now())
                .user(User.builder().id(dto.getUserId()).build())
                .build();
    }

    @Override
    public AppointmentDTO toDto(Appointment entity) {
        return AppointmentDTO.builder()
                .userId(entity.getUser().getId())
                .slotId(entity.getDonationTimeSlot().getId())
                .build();
    }
}
