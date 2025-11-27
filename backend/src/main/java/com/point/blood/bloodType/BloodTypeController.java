package com.point.blood.bloodType;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/blood-types")
public class BloodTypeController {

    private final BloodTypeService bloodTypeService;

    @GetMapping
    public ResponseEntity<List<BloodTypeOptionDTO>> getAllBloodTypes() {
        return ResponseEntity.ok(bloodTypeService.listOptions());
    }
}