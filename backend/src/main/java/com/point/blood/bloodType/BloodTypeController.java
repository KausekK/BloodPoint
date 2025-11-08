package com.point.blood.bloodType;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/blood-types")
public class BloodTypeController {

    private final BloodTypeService service;

    @GetMapping
    public List<BloodTypeOptionDTO> getAll() {
        return service.listOptions();
    }
}