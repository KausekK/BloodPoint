package com.point.blood.appointment.holidays;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PublicHolidayDTO {
    LocalDate date;
    String localName;
    String name;
    boolean global;
}
