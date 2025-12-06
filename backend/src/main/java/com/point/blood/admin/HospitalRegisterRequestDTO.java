package com.point.blood.admin;
import com.point.blood.users.Gender;
import lombok.Data;
import java.time.LocalDate;

@Data
public class HospitalRegisterRequestDTO {
    private String province;
    private String city;
    private String zipCode;
    private String street;
    private String phone;

    private Long hospitalNumber;

    private String firstName;
    private String lastName;
    private String email;
    private String contactPhone;
    private String pesel;
    private LocalDate birthDate;
    private Gender gender;
}
