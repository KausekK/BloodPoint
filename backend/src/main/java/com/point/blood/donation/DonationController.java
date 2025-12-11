package com.point.blood.donation;

import com.point.blood.shared.EditResult;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
public class DonationController {


    private final DonationService donationService;

    @GetMapping("/users/{userId}")
    public ResponseEntity<List<DonationDTO>> getUserDonations(
            @PathVariable Long userId,
            @ModelAttribute DonationHistoryFilterDTO filter
    ) {
        return ResponseEntity.ok(
                donationService.getUserDonations(userId, filter.getDateFrom(), filter.getDateTo())
        );
    }

    @PostMapping("/appointments/{appointmentId}")
    public ResponseEntity<EditResult<NewDonationDTO>> createFromAppointment(
            @PathVariable Long appointmentId,
            @RequestBody NewDonationDTO dto
    ) {
        EditResult<NewDonationDTO> result = donationService.createDonationFromAppointment(appointmentId, dto);
        return ResponseEntity.ok(result);
    }
}
