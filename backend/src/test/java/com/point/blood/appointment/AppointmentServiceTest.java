package com.point.blood.appointment;

import com.point.blood.donationTimeSlot.DonationTimeSlot;
import com.point.blood.donationTimeSlot.DonationTimeSlotRepository;
import com.point.blood.shared.EditResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.orm.ObjectOptimisticLockingFailureException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private DonationTimeSlotRepository timeSlotRepository;

    @Mock
    private AppointmentMapper appointmentMapper;

    @Mock
    private DonationTimeSlotRepository donationTimeSlotRepository;

    private AppointmentService service;

    @BeforeEach
    void setUp() {
        service = new AppointmentService(appointmentRepository, timeSlotRepository, appointmentMapper, donationTimeSlotRepository);
    }

    @Test
    void insertAppointment_slotAvailable_savesAndReturnsSuccess() {
        AppointmentDTO dto = AppointmentDTO.builder().userId(1L).slotId(2L).build();

        when(appointmentRepository.existsRecentOrUpcomingAppointmentForUser(anyLong(), any(), any(), any())).thenReturn(false);

        DonationTimeSlot slot = DonationTimeSlot.builder().id(2L).availableSlot(true).startTime(LocalDateTime.now().plusDays(1)).build();
        when(timeSlotRepository.getReferenceById(2L)).thenReturn(slot);

        Appointment entityFromDto = Appointment.builder().users(null).build();
        when(appointmentMapper.toEntity(dto)).thenReturn(entityFromDto);

        Appointment saved = Appointment.builder().id(10L).users(entityFromDto.getUsers()).donationTimeSlot(slot).build();
        when(appointmentRepository.save(any())).thenReturn(saved);

        AppointmentDTO returnedDto = AppointmentDTO.builder().userId(1L).slotId(2L).build();
        when(appointmentMapper.toDto(saved)).thenReturn(returnedDto);

        EditResult<AppointmentDTO> result = service.insertAppointment(dto);

        assertThat(result).isNotNull();
        assertThat(result.getResultDTO()).isEqualTo(returnedDto);
        assertThat(result.getMessages()).isNotEmpty();
        assertThat(result.getMessages().getFirst().getMsg()).contains("Umówiono wizytę");
        assertThat(slot.isAvailableSlot()).isFalse();

        verify(appointmentRepository).save(any(Appointment.class));
    }

    @Test
    void insertAppointment_slotNotAvailable_returnsError() {
        AppointmentDTO dto = AppointmentDTO.builder().userId(1L).slotId(2L).build();

        when(appointmentRepository.existsRecentOrUpcomingAppointmentForUser(anyLong(), any(), any(), any())).thenReturn(false);

        DonationTimeSlot slot = DonationTimeSlot.builder().id(2L).availableSlot(false).build();
        when(timeSlotRepository.getReferenceById(2L)).thenReturn(slot);

        EditResult<AppointmentDTO> result = service.insertAppointment(dto);

        assertTrue(result.hasErrors());
        assertThat(result.getMessages().getFirst().getMsg()).contains("Termin jest już zajęty");
        verify(appointmentRepository, never()).save(any());
    }

    @Test
    void insertAppointment_recentAppointment_returnsError() {
        AppointmentDTO dto = AppointmentDTO.builder().userId(1L).slotId(2L).build();

        when(appointmentRepository.existsRecentOrUpcomingAppointmentForUser(anyLong(), any(), any(), any())).thenReturn(true);

        EditResult<AppointmentDTO> result = service.insertAppointment(dto);

        assertTrue(result.hasErrors());
        assertThat(result.getMessages().getFirst().getMsg()).contains("Masz już wcześniej umówioną wizytę");
        verify(timeSlotRepository, never()).getReferenceById(anyLong());
        verify(appointmentRepository, never()).save(any());
    }

    @Test
    void insertAppointment_optimisticLock_exceptionHandled() {
        AppointmentDTO dto = AppointmentDTO.builder().userId(1L).slotId(2L).build();

        when(appointmentRepository.existsRecentOrUpcomingAppointmentForUser(anyLong(), any(), any(), any())).thenReturn(false);

        DonationTimeSlot slot = DonationTimeSlot.builder().id(2L).availableSlot(true).build();
        when(timeSlotRepository.getReferenceById(2L)).thenReturn(slot);

        when(appointmentMapper.toEntity(dto)).thenReturn(Appointment.builder().build());
        when(appointmentRepository.save(any())).thenThrow(new ObjectOptimisticLockingFailureException(Appointment.class, 1L));

        EditResult<AppointmentDTO> result = service.insertAppointment(dto);

        assertTrue(result.hasErrors());
        assertThat(result.getMessages().getFirst().getMsg()).contains("Wybierz inny");
    }

    @Test
    void deleteAppointment_restoresSlotAndCancelsAppointment() {
        DonationTimeSlot slot = DonationTimeSlot.builder()
                .id(5L)
                .availableSlot(false)
                .build();

        Appointment appt = Appointment.builder()
                .id(7L)
                .donationTimeSlot(slot)
                .build();

        when(appointmentRepository.findById(7L)).thenReturn(Optional.of(appt));
        when(donationTimeSlotRepository.saveAndFlush(slot)).thenReturn(slot);
        when(appointmentRepository.save(appt)).thenReturn(appt);

        EditResult<AppointmentDTO> result = service.deleteAppointment(7L);

        assertThat(slot.isAvailableSlot()).isTrue();
        assertThat(result.getMessages()).isNotEmpty();
        assertThat(result.getMessages().getFirst().getMsg()).contains("Wizyta została odwołana");

        verify(appointmentRepository).findById(7L);
        verify(donationTimeSlotRepository).saveAndFlush(slot);
        verify(appointmentRepository).save(appt);

        verify(appointmentRepository, never()).delete(any());
    }


    @Test
    void getScheduledAppointmentForUser_delegatesToRepository() {
        when(appointmentRepository.findScheduledAppointmentForUserByUserId(eq(1L), any())).thenReturn(Optional.empty());

        Optional<ScheduledAppointmentForUserDTO> res = service.getScheduledAppointmentForUser(1L);

        assertThat(res).isEmpty();
        verify(appointmentRepository).findScheduledAppointmentForUserByUserId(eq(1L), any());
    }

    @Test
    void getAllAppointmentsForBloodPoint_delegatesToRepository() {
        when(appointmentRepository.findAllTodayAppointmentsForBloodPoint(eq(2L), any(), any())).thenReturn(List.of());

        List<AllAppointmentsDetailsDTO> res = service.getAllAppointmentsForBloodPoint(2L);

        assertThat(res).isEmpty();
        verify(appointmentRepository).findAllTodayAppointmentsForBloodPoint(eq(2L), any(), any());
    }

}
