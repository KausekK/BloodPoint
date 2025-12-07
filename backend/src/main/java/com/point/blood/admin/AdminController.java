package com.point.blood.admin;
import com.point.blood.hospital.HospitalProfileDTO;
import com.point.blood.shared.EditResult;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/donation-point")
    public ResponseEntity<EditResult<Void>> registerDonationPoint(@RequestBody DonationPointRegisterRequestDTO request) {
        return ResponseEntity.ok(adminService.registerDonationPointWithManager(request));
    }

    @PostMapping("/hospital")
    public ResponseEntity<EditResult<HospitalProfileDTO>> registerHospital(@RequestBody HospitalRegisterRequestDTO request) {
        return ResponseEntity.ok(adminService.registerHospitalWithUser(request));
    }

}