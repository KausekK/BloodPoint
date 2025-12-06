package com.point.blood.admin;
import com.point.blood.shared.EditResult;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/donation-point")
@RequiredArgsConstructor
public class AdminDonationPointController {

    private final AdminDonationPointService adminDonationPointService;

    @PostMapping
    public ResponseEntity<EditResult<Void>> registerDonationPoint(
            @RequestBody DonationPointRegisterRequestDTO request
    ) {
        return ResponseEntity.ok(adminDonationPointService.registerDonationPointWithManager(request));
    }
}