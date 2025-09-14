package com.point.blood.donationPoint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BloodDonationPointDTO {
    private Long id;
    private String city;
    private String street;
    private String zipCode;
    private String phone;
}
