package com.point.blood.stock;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BloodStockDTO {
    private Long bloodTypeId;
    private String bloodGroupLabel;
    private Long totalAvailable;
    private Long totalReserved;
    private Long totalFree;
}
