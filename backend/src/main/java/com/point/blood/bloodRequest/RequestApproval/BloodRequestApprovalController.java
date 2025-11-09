package com.point.blood.bloodRequest.RequestApproval;

import com.point.blood.shared.EditResult;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/request")
@RequiredArgsConstructor
public class BloodRequestApprovalController {
    private final BloodRequestApprovalService approvalService;

    @PostMapping("/{id}/accept")
    public ResponseEntity<EditResult<Void>> accept(@PathVariable Long id, @RequestParam Long pointId) {
        return ResponseEntity.ok(approvalService.acceptRequest(id, pointId));
    }
}
