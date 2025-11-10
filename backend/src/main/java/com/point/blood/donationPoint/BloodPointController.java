package com.point.blood.donationPoint;

import com.point.blood.config.JwtUserPrincipal;
import com.point.blood.hospital.HospitalProfileDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/blood_point")
@RequiredArgsConstructor
public class BloodPointController {
    private final BloodPointService bloodPointService;
    private final BloodDonationPointRepository bloodDonationPointRepository;

    @GetMapping("/cities")
    public ResponseEntity<List<String>> getCities() {
        return ResponseEntity.ok(bloodPointService.getCities());
    }

    @GetMapping("/points")
    public ResponseEntity<List<BloodDonationPointDTO>> getPoints(
            @RequestParam(required = false) String city) {
        return ResponseEntity.ok(bloodPointService.getPoints(city));
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<BloodDonationPointProfileDTO> getProfile(@PathVariable Long id) {
        return ResponseEntity.ok(bloodPointService.getBloodPointInfo(id));
    }
}
