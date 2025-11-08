package com.point.blood.bloodRequest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BloodRequestDTO {
    private Long id;
    private Long bloodTypeId;
    private BigDecimal amount;
}
