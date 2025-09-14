package com.point.blood.donationPoint;

import com.point.blood.shared.EditResult;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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


    @PutMapping("/open_hours/{id}") //TODO nie podlaczony, zastanowic sie czy na pewno chcemy to miec
    public ResponseEntity<EditResult<BloodDonationPoint>> setOpenHours(@PathVariable Long id, @RequestParam Double openHour, @RequestParam Double closeHour) {
        return ResponseEntity.ok(bloodPointService.editOpenHours(id, openHour, closeHour));
    }
}
