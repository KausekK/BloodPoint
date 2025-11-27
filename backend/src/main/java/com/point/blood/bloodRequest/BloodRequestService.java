package com.point.blood.bloodRequest;

import com.point.blood.BloodRequestStatus.BloodRequestStatus;
import com.point.blood.BloodRequestStatus.BloodRequestStatusRepository;
import com.point.blood.bloodType.BloodType;
import com.point.blood.bloodType.BloodTypeRepository;
import com.point.blood.hospital.Hospital;
import com.point.blood.hospital.HospitalRepository;
import com.point.blood.shared.ApplicationException;
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
    private final BloodRequestStatusRepository bloodRequestStatusRepository;

    public BloodRequestDTO createBloodRequest(Long hospitalId, BloodRequestDTO dto) {
        if (hospitalId == null) {
            throw ApplicationException.createWithMessage("Brak identyfikatora szpitala.");
        }
        if (dto == null) {
            throw ApplicationException.createWithMessage("Brak danych zgłoszenia.");
        }
        if (dto.getBloodTypeId() == null) {
            throw ApplicationException.createWithMessage("Brak identyfikatora grupy krwi.");
        }
        if (dto.getAmount() == null || dto.getAmount().signum() <= 0) {
            throw ApplicationException.createWithMessage("Ilość musi być dodatnia.");
        }

        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> ApplicationException.createWithMessage("Nie znaleziono szpitala o id {}.", hospitalId));
        BloodType bloodType = bloodTypeRepository.findById(dto.getBloodTypeId())
                .orElseThrow(() -> ApplicationException.createWithMessage("Nie znaleziono grupy krwi o id {}.", dto.getBloodTypeId()));

        BloodRequestStatus newStatus = bloodRequestStatusRepository.findByTypeIgnoreCase("NOWA")
                .orElseThrow(() -> ApplicationException.createWithMessage("Nie znaleziono statusu NOWA."));


        BloodRequest entity = BloodRequest.builder()
                .hospital(hospital)
                .bloodType(bloodType)
                .amount(dto.getAmount())
                .status(newStatus)
                .build();

        BloodRequest saved = bloodRequestRepository.saveAndFlush(entity);

        return new BloodRequestDTO(
                saved.getId(),
                bloodType.getId(),
                saved.getAmount(),
                saved.getCreatedAt()
        );
    }

    public List<BloodRequestListDTO> getAllNewRequests() {
        return bloodRequestRepository.findAllNewRequests();
    }
    public List<BloodRequestListDTO> getAllByHospital(Long hospitalId) {
        if (hospitalId == null) {
            throw ApplicationException.createWithMessage("Brak identyfikatora szpitala.");
        }
        return bloodRequestRepository.findAllHospitalRequests(hospitalId);
    }
}
