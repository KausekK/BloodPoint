package com.point.blood.bloodRequest;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

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
}
