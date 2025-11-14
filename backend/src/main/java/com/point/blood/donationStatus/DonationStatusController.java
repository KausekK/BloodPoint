package com.point.blood.donationStatus;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/donation-statuses")
public class DonationStatusController {
    @GetMapping
    public DonationStatusEnum[] getAllStatuses() {
        return DonationStatusEnum.values();
    }
}
