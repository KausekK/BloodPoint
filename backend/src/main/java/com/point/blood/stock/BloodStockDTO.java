package com.point.blood.stock;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BloodStockDTO {
    private String bloodGroup;
    private Long totalAvailable;
    private Long totalReserved;
    private Long totalFree;
}
