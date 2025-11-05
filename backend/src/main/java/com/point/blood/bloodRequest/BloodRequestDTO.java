package com.point.blood.bloodRequest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BloodRequestDTO {
    private Long id;
    private Long bloodTypeId;
    private Double amount;
}
