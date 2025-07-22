package com.point.blood.donationPoint;

import com.point.blood.shared.EditResult;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/blood_point")
@RequiredArgsConstructor
public class BloodPointController {
    private final BloodPointService bloodPointService;

//    @PutMapping("/open_hours/{id}") //TODO nie podlaczony
//    public ResponseEntity<EditResult<BloodDonationPoint>> setOpenHours(@PathVariable Long id, @RequestParam Double openHour, @RequestParam Double closeHour) {
//        return ResponseEntity.ok(bloodPointService.editOpenHours(id, openHour, closeHour));
//    }
}
