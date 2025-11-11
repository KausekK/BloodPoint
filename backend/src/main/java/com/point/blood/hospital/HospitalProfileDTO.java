package com.point.blood.hospital;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HospitalProfileDTO {
    private Long id;
    private Long hospitalNumber;
    private String province;
    private String city;
    private String zipCode;
    private String street;
    private String phone;
}
