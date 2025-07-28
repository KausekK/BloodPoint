package com.point.blood.donationPoint.menageStaff;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StaffDTO {

    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
//    private String phone;
    private String pesel;
    private LocalDate employmentStartDay;
    private StaffPosition position;
    private Long donationPointId;

}
