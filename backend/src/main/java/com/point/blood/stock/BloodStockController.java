package com.point.blood.stock;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
