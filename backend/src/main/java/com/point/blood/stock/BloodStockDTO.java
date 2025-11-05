package com.point.blood.stock;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class BloodStockDTO {
    private Long bloodTypeId;
    private String bloodGroupLabel;
    private BigDecimal totalAvailable;
    private BigDecimal totalReserved;
    private BigDecimal totalFree;

    public BloodStockDTO(Long bloodTypeId, String bloodGroupLabel,
                         BigDecimal totalAvailable, BigDecimal totalReserved) {
        this.bloodTypeId = bloodTypeId;
        this.bloodGroupLabel = bloodGroupLabel;
        this.totalAvailable = totalAvailable;
        this.totalReserved  = totalReserved;
        this.totalFree = (totalAvailable == null || totalReserved == null)
                ? null : totalAvailable.subtract(totalReserved);
    }
}
