package com.point.blood.hospital;

import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class HospitalServiceTest {

    @Mock
    private HospitalRepository repository;

    @InjectMocks
    private HospitalService service;

    @Test
    void getHospitalInfo_found_returnsProfile() {
        HospitalProfileDTO dto = HospitalProfileDTO.builder()
                .id(1L)
                .hospitalNumber(10L)
                .province("Prov")
                .city("City")
                .zipCode("00-001")
                .street("St")
                .phone("123")
                .build();

        when(repository.findProfileById(1L)).thenReturn(Optional.of(dto));

        var res = service.getHospitalInfo(1L);

        assertThat(res).isEqualTo(dto);
        verify(repository).findProfileById(1L);
    }

    @Test
    void getHospitalInfo_notFound_throwsEntityNotFound() {
        when(repository.findProfileById(2L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getHospitalInfo(2L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Szpital nie istnieje");

        verify(repository).findProfileById(2L);
    }

    @Test
    void getHospitalProvinces_delegatesToRepository() {
        List<String> provinces = List.of("Prov1", "Prov2");
        when(repository.getHospitalsProvince()).thenReturn(provinces);

        var res = service.getHospitalProvinces();

        assertThat(res).isEqualTo(provinces);
        verify(repository).getHospitalsProvince();
    }

    @Test
    void getAllHospitals_delegatesToRepository() {
        HospitalProfileDTO p1 = HospitalProfileDTO.builder()
                .id(1L)
                .hospitalNumber(1L)
                .province("P")
                .city("C")
                .zipCode("z")
                .street("s")
                .phone("t")
                .build();

        when(repository.findAllProfiles()).thenReturn(List.of(p1));

        var res = service.getAllHospitals();

        assertThat(res).containsExactly(p1);
        verify(repository).findAllProfiles();
    }
}
