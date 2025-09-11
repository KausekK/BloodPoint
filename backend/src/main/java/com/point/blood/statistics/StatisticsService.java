package com.point.blood.statistics;

import com.point.blood.donation.DonationRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
public class StatisticsService {

    private final DonationRepository donationRepository;

    public List<DonationStatsView> getStatistics(LocalDate from, LocalDate to) {
       return  donationRepository.getStats(from, to);
    }
}
