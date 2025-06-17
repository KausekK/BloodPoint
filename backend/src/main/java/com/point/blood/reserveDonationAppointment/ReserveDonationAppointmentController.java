package com.point.blood.reserveDonationAppointment;

import com.point.blood.shared.EditResult;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@RestController
@RequestMapping("api/appointment")
@RequiredArgsConstructor
public class ReserveDonationAppointmentController {

    private final IDonationTimeSlotRepository donationTimeSlotRepository;
    private final AppointmentService appointmentService;
    @GetMapping("/available")
    public Page<SlotDTO> getAvailableSlots(@RequestParam String city, @RequestParam LocalDate date, Pageable pageable) {
        LocalDateTime from = date.atStartOfDay();
        LocalDateTime to = from.plusDays(1);
        return donationTimeSlotRepository.findAvailableSlotsForCityAndDay(city, from, to, pageable);
    }

    @PostMapping("/add")
    public ResponseEntity<EditResult<AppointmentDTO>> addAppointment(@RequestBody AppointmentDTO dto){
        return ResponseEntity.ok(appointmentService.insertAppointment(dto));
    }

}
