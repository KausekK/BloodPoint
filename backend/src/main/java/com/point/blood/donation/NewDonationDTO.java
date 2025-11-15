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
public class NewDonationDTO {
    private Long bloodTypeId;
    private DonationStatusEnum donationStatus;
    private BigDecimal amountOfBlood;
    private LocalDateTime donationDate;
    private DonationTypeEnum donationType;
    private Long questionnaireId;
}
