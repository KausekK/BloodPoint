package com.point.blood.donationPoint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
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
    private BigDecimal latitude;
    private BigDecimal longitude;
}
