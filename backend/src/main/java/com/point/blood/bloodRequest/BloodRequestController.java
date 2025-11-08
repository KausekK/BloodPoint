package com.point.blood.bloodRequest;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("api/request")
@RequiredArgsConstructor
public class BloodRequestController {
    private final BloodRequestService service;

    @PostMapping("/hospitals/{hospitalId}/requests")
    public ResponseEntity<BloodRequestDTO> create(
            @PathVariable Long hospitalId,
            @RequestBody BloodRequestDTO dto
    ) {
        return ResponseEntity.ok(service.createBloodRequest(hospitalId, dto));
    }
    @GetMapping("/new")
    public ResponseEntity<List<BloodRequestListDTO>> getNewRequests() {
        return ResponseEntity.ok(service.getAllNewRequests());
    }

    @GetMapping("/requests")
    public ResponseEntity<List<BloodRequestListDTO>> listAllByHospital(@RequestParam Long hospitalId) {
        return ResponseEntity.ok(service.getAllByHospital(hospitalId));
    }
}
