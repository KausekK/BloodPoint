package com.point.blood.admin;

import com.point.blood.users.Gender;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class DonationPointRegisterRequestDTO {

    private String province;
    private String city;
    private String zipCode;
    private String street;
    private String phone;

    private BigDecimal latitude;
    private BigDecimal longitude;

    private String firstName;
    private String lastName;
    private String email;
    private String contactPhone;
    private String pesel;
    private LocalDate birthDate;
    private Gender gender;
}
