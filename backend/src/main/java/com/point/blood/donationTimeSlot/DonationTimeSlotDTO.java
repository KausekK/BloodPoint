package com.point.blood.donationTimeSlot;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class DonationTimeSlotDTO {
    private Long id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String province;
    private String city;
    private String street;
}
