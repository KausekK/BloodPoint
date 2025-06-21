package com.point.blood.donation;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@Transactional
@RequiredArgsConstructor
public class DonationService {
    private final DonationRepository donationRepository;

    public List<DonationDTO> getUserDonations(Long id, LocalDate dateFrom, LocalDate dateTo) {
        if (Objects.isNull(dateFrom) && Objects.isNull(dateTo)) {
            return donationRepository.findAllByDonorUserId(id);
        }
        return donationRepository.findAllByDonorUserIdAndDate(id, dateFrom.atStartOfDay(), dateTo.plusDays(1).atStartOfDay());
    }

}
