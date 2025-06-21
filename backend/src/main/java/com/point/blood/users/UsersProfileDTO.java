package com.point.blood.users;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsersProfileDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String pesel;
    private String bloodGroup;
    private Character rhFactor;
    private LocalDate lastDonationDate;
    private Long totalDonatedBlood;
}
