package com.point.blood.donation;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class DonationService {
    private final DonationRepository donationRepository;

    public List<DonationDTO> getUserDonations(Long id) {
        return donationRepository
                .findAllByDonorUserId(id);
    }

}
