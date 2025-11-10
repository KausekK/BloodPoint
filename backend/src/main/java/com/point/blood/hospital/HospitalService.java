package com.point.blood.hospital;

import com.point.blood.users.UsersProfileDTO;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class HospitalService {
    private final HospitalRepository hospitalRepository;

    public HospitalProfileDTO getHospitalInfo(Long id) {
        return hospitalRepository
                .findProfileById(id)
                .orElseThrow(() -> new EntityNotFoundException("Szpital nie istnieje: " + id));
    }
}
