package com.point.blood.statistics;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("api/statistic")
public class StatisticsController {
    private final StatisticsService statisticsService;

    @GetMapping //TODO nie podlaczone
    public ResponseEntity<List<DonationStatsView>> getStatistics(@RequestParam LocalDate from, @RequestParam LocalDate to) {
        return ResponseEntity.ok(statisticsService.getStatistics(from,to));
    }
}
