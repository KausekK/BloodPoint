package com.point.blood.appointment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AllAppointmentsDetailsDTO {
    private Long appointmentId;
    private Long userId;
    private Long bloodDonationPointId;
    private String firstName;
    private String lastName;
    private String pesel;
    private String email;
//    private String phone;
//    private String gender;
//    private LocalDate dateOfBirth;
    private LocalDate lastDonationDate;
    private String bloodGroup;
    private LocalDateTime appointmentDate;
    private AppointmentStatusEnum appointmentStatus;
}
