package com.point.blood.donationPoint;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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


//    @PutMapping("/open_hours/{id}") //TODO nie podlaczony
//    public ResponseEntity<EditResult<BloodDonationPoint>> setOpenHours(@PathVariable Long id, @RequestParam Double openHour, @RequestParam Double closeHour) {
//        return ResponseEntity.ok(bloodPointService.editOpenHours(id, openHour, closeHour));
//    }
}
