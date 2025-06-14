package com.point.blood.ReserveDonationAppointment;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("api/slots")
@RequiredArgsConstructor
public class DonationTimeSlotController {

    private final IDonationTimeSlotRepository donationTimeSlotRepository;

    @GetMapping("/available")
    public Page<SlotDTO> getAvailableSlots(@RequestParam String city, @RequestParam LocalDate date, Pageable pageable) {
        LocalDateTime from = date.atStartOfDay();
        LocalDateTime to = from.plusDays(1);
        return donationTimeSlotRepository.findAvailableSlotsForCityAndDay(city, from, to, pageable);

    }

}
