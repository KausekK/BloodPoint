package com.point.blood.donation;

import com.point.blood.donationStatus.DonationStatusEnum;
import com.point.blood.donationType.DonationTypeEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DonationDTO {
    private Long id;
    private Long bloodTypeId;
    private BigDecimal amountOfBlood;
    private LocalDateTime donationDate;
    private DonationTypeEnum donationType;
    private String city;
    private String street;
    private DonationStatusEnum donationStatus;
}
