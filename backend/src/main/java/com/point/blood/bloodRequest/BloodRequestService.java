package com.point.blood.bloodRequest;

import com.point.blood.BloodRequestStatus.BloodRequestStatus;
import com.point.blood.BloodRequestStatus.BloodRequestStatusRepository;
import com.point.blood.bloodType.BloodType;
import com.point.blood.bloodType.BloodTypeRepository;
import com.point.blood.hospital.Hospital;
import com.point.blood.hospital.HospitalRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class BloodRequestService {

    private final BloodRequestRepository bloodRequestRepository;
    private final HospitalRepository hospitalRepository;
    private final BloodTypeRepository bloodTypeRepository;
    private final BloodRequestStatusRepository statusRepository;

    public BloodRequestDTO createBloodRequest(Long hospitalId, BloodRequestDTO dto) {
        if (hospitalId == null) throw new IllegalArgumentException("Brak identyfikatora szpitala.");
        if (dto == null) throw new IllegalArgumentException("Brak danych zgłoszenia.");

        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new IllegalArgumentException("Nie znaleziono szpitala."));
        BloodType bt = bloodTypeRepository.findById(dto.getBloodTypeId())
                .orElseThrow(() -> new IllegalArgumentException("Nie znaleziono grupy krwi."));

        BloodRequestStatus newStatus = statusRepository.findByTypeIgnoreCase("NOWA")
                .orElseThrow(() -> new IllegalStateException("Nie znaleziono statusu NOWA."));


        BloodRequest entity = new BloodRequest();
        entity.setHospital(hospital);
        entity.setBloodType(bt);
        entity.setAmount(dto.getAmount());
        entity.setStatus(newStatus);

        BloodRequest saved = bloodRequestRepository.saveAndFlush(entity);

        return new BloodRequestDTO(saved.getId(), bt.getId(), saved.getAmount());
    }

    public List<BloodRequestListDTO> getAllNewRequests() {
        return bloodRequestRepository.findAllNewRequests();
    }
    public List<BloodRequestListDTO> getAllByHospital(Long hospitalId) {
        return bloodRequestRepository.findAllHospitalRequests(hospitalId);
    }
}
