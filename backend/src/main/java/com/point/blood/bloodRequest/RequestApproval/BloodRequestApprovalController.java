package com.point.blood.bloodRequest.RequestApproval;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/request")
@RequiredArgsConstructor
public class BloodRequestApprovalController {
    private final BloodRequestApprovalService approvalService;

    @PostMapping("/{id}/accept")
    public ResponseEntity<Void> accept(@PathVariable Long id, @RequestParam Long pointId) {
        approvalService.acceptRequest(id, pointId);
        return ResponseEntity.noContent().build();
    }
}
