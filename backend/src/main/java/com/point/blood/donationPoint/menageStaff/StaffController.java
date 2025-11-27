package com.point.blood.donationPoint.menageStaff;
import com.point.blood.shared.EditResult;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blood_point/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;
    private final StaffRepository staffRepository;

    @GetMapping("/{pointId}")
    public ResponseEntity<List<StaffDTO>> getStaffByPoint(@PathVariable Long pointId) {
        return ResponseEntity.ok(staffRepository.findAllByBloodDonationPoint_Id(pointId));
    }


    @DeleteMapping("/{staffId}")
    public ResponseEntity<EditResult<Void>> removeEmployee(@PathVariable Long staffId) {
        return ResponseEntity.ok(staffService.deleteEmployee(staffId));
    }

    @PatchMapping("/{staffId}")
    public ResponseEntity<EditResult<StaffDTO>> updateStaff(@PathVariable Long staffId, @RequestBody @Valid StaffUpdateDTO request) {
        return ResponseEntity.ok(staffService.editEmployee(staffId, request));
    }

}