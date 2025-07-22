package com.point.blood.donationPoint.menageStaff;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StaffUpdateDTO {
    private LocalDate employmentStartDay;
    private StaffPosition position;
    private Long bloodDonationPointId;
}
