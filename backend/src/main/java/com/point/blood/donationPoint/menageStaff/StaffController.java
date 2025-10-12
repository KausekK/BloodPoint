package com.point.blood.donationPoint.menageStaff;
import com.point.blood.shared.EditResult;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/blood_point/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;
    private final StaffRepository staffRepository;

    @GetMapping("/{id}")
    public List<StaffDTO> getStaffByPoint(@PathVariable("id") Long id) {
        return staffRepository.findAllByBloodDonationPoint_Id(id);
    }


    //TODO dodanie pracownika - czeka az bedzie mozliwosc dodania usera i uprawnien

    @DeleteMapping("/{id}")
    public ResponseEntity<EditResult<Void>> removeEmployee(@PathVariable Long id) {
        return ResponseEntity.ok(staffService.deleteEmployee(id));
    }

    @PatchMapping("/{id}")// TODO nie podlaczone + do przetestowania
    public ResponseEntity<EditResult<StaffDTO>> updateStaff(@PathVariable Long id, @RequestBody @Valid StaffUpdateDTO request) {
        return ResponseEntity.ok(staffService.editEmployee(id, request));
    }

}