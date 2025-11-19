package com.point.blood.hospital;

import com.point.blood.users.UsersProfileDTO;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class HospitalService {
    private final HospitalRepository hospitalRepository;

    public HospitalProfileDTO getHospitalInfo(Long hospitalId) {
        return hospitalRepository
                .findProfileById(hospitalId)
                .orElseThrow(() -> new EntityNotFoundException("Szpital nie istnieje: " + hospitalId));
    }
    public List<String> getHospitalProvinces() {
        return hospitalRepository.getHospitalsProvince();
    }

}
