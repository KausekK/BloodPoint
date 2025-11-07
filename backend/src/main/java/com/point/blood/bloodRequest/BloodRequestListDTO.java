package com.point.blood.bloodRequest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BloodRequestListDTO {
    private Long id;
    private Long hospitalNumber;
    private String hospitalCity;
    private String bloodTypeLabel;
    private BigDecimal amount;
}
