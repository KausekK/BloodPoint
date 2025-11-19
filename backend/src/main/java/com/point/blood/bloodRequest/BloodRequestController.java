package com.point.blood.bloodRequest;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class BloodRequestController {
    private final BloodRequestService bloodRequestService;

    @PostMapping("/hospitals/{hospitalId}")
    public ResponseEntity<BloodRequestDTO> create(
            @PathVariable Long hospitalId,
            @RequestBody BloodRequestDTO dto
    ) {
        return ResponseEntity.ok(bloodRequestService.createBloodRequest(hospitalId, dto));
    }
    @GetMapping("/new")
    public ResponseEntity<List<BloodRequestListDTO>> getNewRequests() {
        return ResponseEntity.ok(bloodRequestService.getAllNewRequests());
    }

    @GetMapping
    public ResponseEntity<List<BloodRequestListDTO>> listAllByHospital(@RequestParam Long hospitalId) {
        return ResponseEntity.ok(bloodRequestService.getAllByHospital(hospitalId));
    }
}
