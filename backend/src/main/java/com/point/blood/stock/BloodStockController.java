package com.point.blood.stock;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("api/blood_stock")
@RequiredArgsConstructor
public class BloodStockController {

    private final BloodStockService bloodStockService;

    @GetMapping
    public ResponseEntity<List<BloodStockDTO>> getBloodStock() {
        return ResponseEntity.ok(bloodStockService.getBloodStock());
    }

    @GetMapping("/point/{id}")
    public ResponseEntity<List<BloodStockDTO>> getBloodStockByDonationPoint(@PathVariable Long id) {
        return ResponseEntity.ok(bloodStockService.getBloodStockByBloodDonationPointId(id));
    }
    @PostMapping("/point/{id}/deliveries")
    public ResponseEntity<BloodStockDTO> registerDelivery(
            @PathVariable("id") Long pointId,
            @Valid @RequestBody RegisterDeliveryRequest req
    ) {
        BloodStockDTO dto = bloodStockService.registerDelivery(pointId, req);
        return ResponseEntity.created(URI.create("/api/blood_stock/point/" + pointId)).body(dto);
    }
}
