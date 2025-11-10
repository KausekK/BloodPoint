package com.point.blood.hospital;

import com.point.blood.users.UsersProfileDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/hospital")
@RequiredArgsConstructor
public class HospitalController {
    private final HospitalRepository hospitalRepository;
    private final HospitalService hospitalService;

    @GetMapping("/provinces")
    public List<String> getHospitalsProvince() {
        return hospitalRepository.getHospitalsProvince();
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<HospitalProfileDTO> getProfile(@PathVariable Long id) {
        return ResponseEntity.ok(hospitalService.getHospitalInfo(id));
    }
}
