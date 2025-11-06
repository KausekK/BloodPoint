package com.point.blood.bloodRequest;

import com.point.blood.bloodType.BloodType;
import com.point.blood.bloodType.BloodTypeRepository;
import com.point.blood.hospital.Hospital;
import com.point.blood.hospital.HospitalRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class BloodRequestService {

    private final BloodRequestRepository bloodRequestRepository;
    private final HospitalRepository hospitalRepository;
    private final BloodTypeRepository bloodTypeRepository;

    public BloodRequestDTO createBloodRequest(Long hospitalId, BloodRequestDTO dto) {
        if (hospitalId == null) throw new IllegalArgumentException("Brak identyfikatora szpitala.");
        if (dto == null) throw new IllegalArgumentException("Brak danych zgłoszenia.");

        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new IllegalArgumentException("Nie znaleziono szpitala."));
        BloodType bt = bloodTypeRepository.findById(dto.getBloodTypeId())
                .orElseThrow(() -> new IllegalArgumentException("Nie znaleziono grupy krwi."));

        BloodRequest entity = new BloodRequest();
        entity.setHospital(hospital);
        entity.setBloodType(bt);
        entity.setAmount(dto.getAmount());

        BloodRequest saved = bloodRequestRepository.saveAndFlush(entity);

        return new BloodRequestDTO(saved.getId(), bt.getId(), saved.getAmount());
    }
}
