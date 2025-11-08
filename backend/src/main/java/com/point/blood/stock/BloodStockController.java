package com.point.blood.stock;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("api/blood_stock")
@RequiredArgsConstructor
public class BloodStockController {

    private final BloodStockService bloodStockService;

    @GetMapping()
    public List<BloodStockDTO> getBloodStock() {
        return bloodStockService.getBloodStock();
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
