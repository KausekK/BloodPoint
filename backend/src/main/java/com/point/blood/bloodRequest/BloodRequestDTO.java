package com.point.blood.bloodRequest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BloodRequestDTO {
    private Long id;
    private Long bloodTypeId;
    private BigDecimal amount;
    private LocalDateTime createdAt;
}
