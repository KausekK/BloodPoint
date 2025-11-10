package com.point.blood.donationPoint;

import com.point.blood.hospital.HospitalProfileDTO;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class BloodPointService {
    private final BloodDonationPointRepository bloodDonationPointRepository;

    public List<String> getCities() {
        return bloodDonationPointRepository.getDonationPointCities();
    }

    public List<BloodDonationPointDTO> getPoints(String city) {
        return bloodDonationPointRepository.findPoints(city);
    }

    public BloodDonationPointProfileDTO getBloodPointInfo(Long id) {
        return bloodDonationPointRepository
                .findProfileById(id)
                .orElseThrow(() -> new EntityNotFoundException("Punkt krwiodawstwa nie istnieje: " + id));
    }

}
