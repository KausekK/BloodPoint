package com.point.blood.auth;

import com.point.blood.role.RoleEnum;
import com.point.blood.users.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String firstName;
    private String lastName;
    private String pesel;
    private String phone;
    private String email;
    private RoleEnum roleName;
    private Gender gender;
    private LocalDate birthDate;
    private String password;
}
