package com.point.blood.appointment;

import com.point.blood.appointment.holidays.HolidayService;
import com.point.blood.donationTimeSlot.DonationTimeSlotRepository;
import com.point.blood.donationTimeSlot.DonationTimeSlotDTO;
import com.point.blood.shared.EditResult;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("api/appointment")
@RequiredArgsConstructor
public class AppointmentController {

    private final DonationTimeSlotRepository donationTimeSlotRepository;
    private final AppointmentService appointmentService;
    private final HolidayService holidayService;


    @GetMapping("/available")
    public Page<DonationTimeSlotDTO> getAvailableSlots(
            @RequestParam String city,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            Pageable pageable) {

        if (holidayService.isHoliday(date)) {
            return Page.empty(pageable);
        }

        LocalDateTime from = date.atStartOfDay();
        LocalDateTime to   = from.plusDays(1);

        return donationTimeSlotRepository.findAvailableSlotsForCityAndDay(city, from, to, pageable);
    }

    @PostMapping("/add")
    public ResponseEntity<EditResult<AppointmentDTO>> addAppointment(@RequestBody AppointmentDTO dto) {
        return ResponseEntity.ok(appointmentService.insertAppointment(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<EditResult<AppointmentDTO>> removeAppointment(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.deleteAppointment(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<ScheduledAppointmentForUserDTO>> getScheduledAppointmentForUser(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.getScheduledAppointmentForUser(id));
    }

    @GetMapping("/point/all/{id}")
    public ResponseEntity<List<AllAppointmentsDetailsDTO>> getAllTodayAppointmentsForBloodPoint(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.getAllAppointmentsForBloodPoint(id));
    }
}
