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
    private LocalDate birthDate;
    private String phone;
    private Gender gender;
    private String bloodGroup;
    private Character rhFactor;
    private LocalDate lastDonationDate;
    private Long totalDonatedBlood;

    public UsersProfileDTO(Long id, String firstName, String lastName, String email, String pesel,
                           LocalDate birthDate, String phone, Gender gender,
                           String bloodGroup, Character rhFactor,
                           LocalDate lastDonationDate, int totalDonatedBlood) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.pesel = pesel;
        this.birthDate = birthDate;
        this.phone = phone;
        this.gender = gender;
        this.bloodGroup = bloodGroup;
        this.rhFactor = rhFactor;
        this.lastDonationDate = lastDonationDate;
        this.totalDonatedBlood = (long) totalDonatedBlood;
    }
}
