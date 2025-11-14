package com.point.blood.appointment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/appointment-statuses")
public class AppointmentStatusController {
    @GetMapping
    public AppointmentStatusEnum[] getAllStatuses() {
        return AppointmentStatusEnum.values();
    }
}
