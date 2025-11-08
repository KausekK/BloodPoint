package com.point.blood.bloodType;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BloodTypeService {
    private final BloodTypeRepository repo;
    public List<BloodTypeOptionDTO> listOptions() {
        return repo.findAll().stream()
                .map(bt -> new BloodTypeOptionDTO(bt.getId(), bt.getBloodGroup() + " Rh" + bt.getRhFactor()))
                .toList();
    }
}