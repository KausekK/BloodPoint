package com.point.blood.donationPoint;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/blood_point")
@RequiredArgsConstructor
public class BloodPointController {
    private final BloodPointService bloodPointService;
    private final BloodDonationPointRepository bloodDonationPointRepository;

    @GetMapping("/cities")
    public List<String> getCities() {
        return bloodDonationPointRepository.getDonationPointCities();
    }

    @GetMapping("/points")
    public ResponseEntity<List<BloodDonationPointDTO>> getPoints(
            @RequestParam(required = false) String city) {
        return ResponseEntity.ok(bloodDonationPointRepository.findPoints(city));
    }
}
