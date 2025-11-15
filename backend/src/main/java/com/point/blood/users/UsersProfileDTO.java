package com.point.blood.users;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
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
    private LocalDate birthDate;
    private String phone;
    private Gender gender;
    private String bloodGroup;
    private Character rhFactor;
    private LocalDate lastDonationDate;
    private BigDecimal totalDonatedBlood;

}
