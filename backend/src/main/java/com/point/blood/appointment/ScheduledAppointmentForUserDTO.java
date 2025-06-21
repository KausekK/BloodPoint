package com.point.blood.appointment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScheduledAppointmentForUserDTO {
    private Long appointmentId;
    private Long userId;
    private LocalDateTime appointmentTime;
    private String appointmentCity;
    private String appointmentStreet;
}
