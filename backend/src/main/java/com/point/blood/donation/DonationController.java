package com.point.blood.donation;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/donations")
@RequiredArgsConstructor
public class DonationController {


    private final DonationService donationService;

    @GetMapping("/{id}")
    public ResponseEntity<List<DonationDTO>> getDonation(@PathVariable Long id) {
        return ResponseEntity.ok(donationService.getUserDonations(id));
    }
}
