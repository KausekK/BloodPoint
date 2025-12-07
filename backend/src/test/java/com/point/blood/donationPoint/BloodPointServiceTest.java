package com.point.blood.donationPoint;

import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BloodPointServiceTest {

    @Mock
    private BloodDonationPointRepository repository;

    private BloodPointService service;

    @BeforeEach
    void setUp() {
        service = new BloodPointService(repository);
    }

    @Test
    void getCities_delegatesToRepository() {
        when(repository.getDonationPointCities()).thenReturn(List.of("Warsaw", "Krakow"));

        var res = service.getCities();

        assertThat(res).containsExactly("Warsaw", "Krakow");
    }

    @Test
    void getPoints_delegatesToRepository() {
        BloodDonationPointDTO p1 = BloodDonationPointDTO.builder()
                .id(1L)
                .city("City1")
                .street("Street")
                .zipCode("00-001")
                .phone("123")
                .build();
        when(repository.findPoints("City1")).thenReturn(List.of(p1));

        var res = service.getPoints("City1");

        assertThat(res).hasSize(1);
        assertThat(res.get(0).getId()).isEqualTo(1L);
    }

    @Test
    void getBloodPointInfo_found_returnsProfile() {
        BloodDonationPointProfileDTO dto = BloodDonationPointProfileDTO.builder()
                .id(5L)
                .city("City")
                .province("Prov")
                .street("St")
                .zipCode("00-001")
                .phone("123")
                .build();
        when(repository.findProfileById(5L)).thenReturn(Optional.of(dto));

        var res = service.getBloodPointInfo(5L);

        assertThat(res).isEqualTo(dto);
    }

    @Test
    void getBloodPointInfo_notFound_throws() {
        when(repository.findProfileById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getBloodPointInfo(99L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Punkt krwiodawstwa nie istnieje: 99");
    }

}
