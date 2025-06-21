package com.point.blood.stock;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BloodStockService {

    private final BloodStockRepository bloodStockRepository;

    public List<BloodStockDTO> getBloodStock() {
        return bloodStockRepository.findTotalStockByBloodType();
    }
}
