package com.point.blood.admin;

import com.point.blood.hospital.HospitalProfileDTO;
import com.point.blood.shared.EditResult;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/hospital")
@RequiredArgsConstructor
public class AdminHospitalController {

    private final AdminHospitalService adminHospitalService;

    @PostMapping
    public ResponseEntity<EditResult<HospitalProfileDTO>> registerHospital(
            @RequestBody HospitalRegisterRequestDTO request
    ) {
        return ResponseEntity.ok(adminHospitalService.registerHospitalWithUser(request));
    }
}
