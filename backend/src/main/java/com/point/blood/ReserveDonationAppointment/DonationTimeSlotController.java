package com.point.blood.ReserveDonationAppointment;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/slots")
public class DonationTimeSlotController {

    private final IDonationTimeSlotRepository donationTimeSlotRepository;


    @GetMapping("/available")
    public Page<SlotDTO> getAvailableSlots(@RequestParam String city, Pageable pageable) {
        return donationTimeSlotRepository.findAvailableSlotsForCity(city ,pageable);
    }
}
