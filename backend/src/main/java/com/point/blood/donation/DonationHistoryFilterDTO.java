package com.point.blood.donation;

import lombok.Data;
import java.time.LocalDate;

@Data
public class DonationHistoryFilterDTO {
    private LocalDate dateFrom;
    private LocalDate dateTo;
}
