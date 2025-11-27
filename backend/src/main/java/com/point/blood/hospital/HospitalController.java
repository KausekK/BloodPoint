package com.point.blood.hospital;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/hospital")
@RequiredArgsConstructor
public class HospitalController {
    private final HospitalService hospitalService;

    @GetMapping("/provinces")
    public ResponseEntity<List<String>> getHospitalProvinces() {
        return ResponseEntity.ok(hospitalService.getHospitalProvinces());
    }
    @GetMapping("/profile/{hospitalId}")
    public ResponseEntity<HospitalProfileDTO> getProfile(@PathVariable Long hospitalId) {
        return ResponseEntity.ok(hospitalService.getHospitalInfo(hospitalId));
    }
}
