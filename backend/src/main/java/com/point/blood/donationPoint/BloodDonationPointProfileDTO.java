package com.point.blood.donationPoint;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BloodDonationPointProfileDTO {
    private Long id;
    private String city;
    private String province;
    private String street;
    private String zipCode;
    private String phone;
}

