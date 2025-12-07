package com.point.blood.bloodType;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BloodTypeServiceTest {

    @Mock
    private BloodTypeRepository bloodTypeRepository;

    private BloodTypeService service;

    @BeforeEach
    void setUp() {
        service = new BloodTypeService(bloodTypeRepository);
    }

    @Test
    void listOptions_empty_returnsEmptyList() {
        when(bloodTypeRepository.findAll()).thenReturn(List.of());

        var res = service.listOptions();

        assertThat(res).isNotNull();
        assertThat(res).isEmpty();
    }

    @Test
    void listOptions_withValues_mapsToDto() {
        BloodType aPos = BloodType.builder().id(1L).bloodGroup("A").rhFactor('+').build();
        BloodType oNeg = BloodType.builder().id(2L).bloodGroup("O").rhFactor('-').build();

        when(bloodTypeRepository.findAll()).thenReturn(List.of(aPos, oNeg));

        var res = service.listOptions();

        assertThat(res).hasSize(2);
        assertThat(res).extracting("id").containsExactly(1L, 2L);
        assertThat(res).extracting("label").containsExactly("A Rh+", "O Rh-");
    }

}
