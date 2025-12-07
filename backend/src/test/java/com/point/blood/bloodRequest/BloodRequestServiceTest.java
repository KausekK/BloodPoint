package com.point.blood.bloodRequest;

import com.point.blood.BloodRequestStatus.BloodRequestStatus;
import com.point.blood.BloodRequestStatus.BloodRequestStatusRepository;
import com.point.blood.bloodType.BloodType;
import com.point.blood.bloodType.BloodTypeRepository;
import com.point.blood.hospital.Hospital;
import com.point.blood.hospital.HospitalRepository;
import com.point.blood.shared.ApplicationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BloodRequestServiceTest {

    @Mock
    private BloodRequestRepository bloodRequestRepository;

    @Mock
    private HospitalRepository hospitalRepository;

    @Mock
    private BloodTypeRepository bloodTypeRepository;

    @Mock
    private BloodRequestStatusRepository bloodRequestStatusRepository;

    private BloodRequestService service;

    @Captor
    private ArgumentCaptor<BloodRequest> requestCaptor;

    @BeforeEach
    void setUp() {
        service = new BloodRequestService(bloodRequestRepository, hospitalRepository, bloodTypeRepository, bloodRequestStatusRepository);
    }

    @Test
    void createBloodRequest_nullHospitalId_throws() {
        assertThatThrownBy(() -> service.createBloodRequest(null, new BloodRequestDTO()))
                .isInstanceOf(ApplicationException.class)
                .hasMessageContaining("Brak identyfikatora szpitala.");
    }

    @Test
    void createBloodRequest_nullDto_throws() {
        assertThatThrownBy(() -> service.createBloodRequest(1L, null))
                .isInstanceOf(ApplicationException.class)
                .hasMessageContaining("Brak danych zgłoszenia.");
    }

    @Test
    void createBloodRequest_missingBloodTypeId_throws() {
        BloodRequestDTO dto = new BloodRequestDTO();
        dto.setAmount(BigDecimal.TEN);
        assertThatThrownBy(() -> service.createBloodRequest(1L, dto))
                .isInstanceOf(ApplicationException.class)
                .hasMessageContaining("Brak identyfikatora grupy krwi.");
    }

    @Test
    void createBloodRequest_nonPositiveAmount_throws() {
        BloodRequestDTO dto = new BloodRequestDTO();
        dto.setBloodTypeId(2L);
        dto.setAmount(BigDecimal.ZERO);
        assertThatThrownBy(() -> service.createBloodRequest(1L, dto))
                .isInstanceOf(ApplicationException.class)
                .hasMessageContaining("Ilość musi być dodatnia.");
    }

    @Test
    void createBloodRequest_hospitalNotFound_throws() {
        BloodRequestDTO dto = new BloodRequestDTO();
        dto.setBloodTypeId(2L);
        dto.setAmount(BigDecimal.ONE);

        when(hospitalRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.createBloodRequest(1L, dto))
                .isInstanceOf(ApplicationException.class)
                .hasMessageContaining("Nie znaleziono szpitala");
    }

    @Test
    void createBloodRequest_bloodTypeNotFound_throws() {
        BloodRequestDTO dto = new BloodRequestDTO();
        dto.setBloodTypeId(2L);
        dto.setAmount(BigDecimal.ONE);

        when(hospitalRepository.findById(1L)).thenReturn(Optional.of(Hospital.builder().id(1L).build()));
        when(bloodTypeRepository.findById(2L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.createBloodRequest(1L, dto))
                .isInstanceOf(ApplicationException.class)
                .hasMessageContaining("Nie znaleziono grupy krwi");
    }

    @Test
    void createBloodRequest_statusNotFound_throws() {
        BloodRequestDTO dto = new BloodRequestDTO();
        dto.setBloodTypeId(2L);
        dto.setAmount(BigDecimal.ONE);

        when(hospitalRepository.findById(1L)).thenReturn(Optional.of(Hospital.builder().id(1L).build()));
        when(bloodTypeRepository.findById(2L)).thenReturn(Optional.of(BloodType.builder().id(2L).build()));
        when(bloodRequestStatusRepository.findByTypeIgnoreCase("NOWA")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.createBloodRequest(1L, dto))
                .isInstanceOf(ApplicationException.class)
                .hasMessageContaining("Nie znaleziono statusu NOWA");
    }

    @Test
    void createBloodRequest_success_savesAndReturnsDto() {
        BloodRequestDTO dto = new BloodRequestDTO();
        dto.setBloodTypeId(2L);
        dto.setAmount(new BigDecimal("5.5"));

        Hospital hospital = Hospital.builder().id(1L).build();
        BloodType bloodType = BloodType.builder().id(2L).bloodGroup("A").rhFactor('+' ).build();
        BloodRequestStatus status = BloodRequestStatus.builder().id(3L).type("NOWA").build();

        when(hospitalRepository.findById(1L)).thenReturn(Optional.of(hospital));
        when(bloodTypeRepository.findById(2L)).thenReturn(Optional.of(bloodType));
        when(bloodRequestStatusRepository.findByTypeIgnoreCase("NOWA")).thenReturn(Optional.of(status));

        BloodRequest saved = BloodRequest.builder()
                .id(99L)
                .hospital(hospital)
                .bloodType(bloodType)
                .amount(dto.getAmount())
                .status(status)
                .createdAt(LocalDateTime.now())
                .build();

        when(bloodRequestRepository.saveAndFlush(any())).thenReturn(saved);

        BloodRequestDTO result = service.createBloodRequest(1L, dto);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(99L);
        assertThat(result.getBloodTypeId()).isEqualTo(2L);
        assertThat(result.getAmount()).isEqualByComparingTo(new BigDecimal("5.5"));

        verify(bloodRequestRepository).saveAndFlush(requestCaptor.capture());
        BloodRequest captured = requestCaptor.getValue();
        assertThat(captured.getHospital()).isEqualTo(hospital);
        assertThat(captured.getBloodType()).isEqualTo(bloodType);
        assertThat(captured.getAmount()).isEqualByComparingTo(new BigDecimal("5.5"));
        assertThat(captured.getStatus()).isEqualTo(status);
    }

    @Test
    void getAllNewRequests_delegatesToRepository() {
        when(bloodRequestRepository.findAllNewRequests()).thenReturn(List.of());
        List<BloodRequestListDTO> res = service.getAllNewRequests();
        assertThat(res).isEmpty();
        verify(bloodRequestRepository).findAllNewRequests();
    }

    @Test
    void getAllByHospital_nullId_throws() {
        assertThatThrownBy(() -> service.getAllByHospital(null))
                .isInstanceOf(ApplicationException.class)
                .hasMessageContaining("Brak identyfikatora szpitala.");
    }

    @Test
    void getAllByHospital_delegatesToRepository() {
        when(bloodRequestRepository.findAllHospitalRequests(1L)).thenReturn(List.of());
        List<BloodRequestListDTO> res = service.getAllByHospital(1L);
        assertThat(res).isEmpty();
        verify(bloodRequestRepository).findAllHospitalRequests(1L);
    }

}
