package com.point.blood.appointment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class SlotDTO {
    private Long id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String province;
    private String city;
    private String street;
}
