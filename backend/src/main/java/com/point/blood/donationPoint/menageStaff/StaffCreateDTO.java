package com.point.blood.donationPoint.menageStaff;

import com.point.blood.users.Gender;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StaffCreateDTO {

    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String pesel;
    private LocalDate birthDate;
    private Gender gender;
    private StaffPosition position;
}
