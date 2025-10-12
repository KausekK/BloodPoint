package com.point.blood.stock;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BloodStockService {

    private final BloodStockRepository bloodStockRepository;

    public List<BloodStockDTO> getBloodStock() {
        return bloodStockRepository.findTotalStockByBloodType();
    }
    public List<BloodStockDTO> getBloodStockByBloodDonationPointId(Long pointId) {
        return bloodStockRepository.findStockByPointId(pointId);
    }
}
