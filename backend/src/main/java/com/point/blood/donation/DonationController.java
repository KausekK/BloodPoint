package com.point.blood.donation;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/donations")
@RequiredArgsConstructor
public class DonationController {


    private final DonationService donationService;

    @PostMapping("/{id}")
    public ResponseEntity<List<DonationDTO>> getDonations(@PathVariable Long id, @RequestBody DonationHistoryFilterDTO params) {
        return ResponseEntity.ok(donationService.getUserDonations(id, params.getDateFrom(), params.getDateTo()));
    }
}
