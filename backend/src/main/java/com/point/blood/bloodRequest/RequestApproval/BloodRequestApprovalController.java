package com.point.blood.bloodRequest.RequestApproval;

import com.point.blood.shared.EditResult;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/requests")
@RequiredArgsConstructor
public class BloodRequestApprovalController {
    private final BloodRequestApprovalService approvalService;

    @PostMapping("/{requestId}/accept")
    public ResponseEntity<EditResult<Void>> accept(@PathVariable Long requestId, @RequestParam Long pointId) {
        return ResponseEntity.ok(approvalService.acceptRequest(requestId, pointId));
    }
}
