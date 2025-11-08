package com.point.blood.bloodRequest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BloodRequestListDTO {
    private Long id;
    private Long hospitalNumber;
    private String hospitalCity;
    private String bloodTypeLabel;
    private BigDecimal amount;
    private String status;
    private LocalDateTime createdAt;
}
