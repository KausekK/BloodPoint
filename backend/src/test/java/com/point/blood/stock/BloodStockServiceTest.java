package com.point.blood.stock;

import com.point.blood.bloodType.BloodType;
import com.point.blood.bloodType.BloodTypeRepository;
import com.point.blood.donationPoint.BloodDonationPoint;
import com.point.blood.donationPoint.BloodDonationPointRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BloodStockServiceTest {

    @Mock
    BloodStockRepository stockRepository;

    @Mock
    BloodTypeRepository typeRepository;

    @Mock
    BloodDonationPointRepository pointRepository;

    @InjectMocks
    BloodStockService service;

    @Test
    void getBloodStock_delegatesToRepository() {
        var dto = new BloodStockDTO(1L, "A Rh+", BigDecimal.ONE, BigDecimal.ZERO, BigDecimal.ONE);
        when(stockRepository.findTotalStockByBloodType()).thenReturn(List.of(dto));

        var res = service.getBloodStock();

        assertThat(res).containsExactly(dto);
        verify(stockRepository).findTotalStockByBloodType();
    }

    @Test
    void getBloodStockByPoint_delegatesToRepository() {
        var dto = new BloodStockDTO(2L, "B Rh-", BigDecimal.TEN, BigDecimal.ONE, BigDecimal.valueOf(9));
        when(stockRepository.findStockByPointId(5L)).thenReturn(List.of(dto));

        var res = service.getBloodStockByBloodDonationPointId(5L);

        assertThat(res).containsExactly(dto);
        verify(stockRepository).findStockByPointId(5L);
    }

    @Test
    void registerDelivery_nullBloodTypeId_throws() {
        var req = new RegisterDeliveryRequest();
        req.setBloodTypeId(null);
        req.setLiters(BigDecimal.ONE);

        assertThatThrownBy(() -> service.registerDelivery(1L, req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Brak identyfikatora typu krwi");
    }

    @Test
    void registerDelivery_invalidLiters_throws() {
        var req = new RegisterDeliveryRequest();
        req.setBloodTypeId(1L);
        req.setLiters(BigDecimal.ZERO);

        assertThatThrownBy(() -> service.registerDelivery(1L, req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Ilość musi być dodatnia");
    }

    @Test
    void registerDelivery_unknownBloodType_throws() {
        var req = new RegisterDeliveryRequest();
        req.setBloodTypeId(99L);
        req.setLiters(BigDecimal.ONE);

        when(typeRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.registerDelivery(1L, req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Nieznany typ krwi");
    }

    @Test
    void registerDelivery_unknownPoint_throws() {
        var req = new RegisterDeliveryRequest();
        req.setBloodTypeId(2L);
        req.setLiters(BigDecimal.ONE);

        when(typeRepository.findById(2L)).thenReturn(Optional.of(BloodType.builder().id(2L).bloodGroup("A").rhFactor('D').build()));
        when(pointRepository.findById(7L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.registerDelivery(7L, req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Nie znaleziono punktu o id");
    }

    @Test
    void registerDelivery_success_createsOrUpdatesRow_andReturnsDTO() {
        var req = new RegisterDeliveryRequest();
        req.setBloodTypeId(3L);
        req.setLiters(new BigDecimal("1.2345"));

        var bloodType = BloodType.builder().id(3L).bloodGroup("A").rhFactor('D').build();
        var point = BloodDonationPoint.builder().id(20L).build();

        when(typeRepository.findById(3L)).thenReturn(Optional.of(bloodType));
        when(pointRepository.findById(20L)).thenReturn(Optional.of(point));

        when(stockRepository.findByDonationPointIdAndBloodTypeId(20L, 3L)).thenReturn(Optional.empty());

        service.registerDelivery(20L, req);

        ArgumentCaptor<BloodPointBloodTyp> captor = ArgumentCaptor.forClass(BloodPointBloodTyp.class);
        verify(stockRepository).save(captor.capture());

        BloodPointBloodTyp saved = captor.getValue();
        assertThat(saved.getAvailableQuantity()).isEqualByComparingTo(new BigDecimal("1.235"));
        assertThat(saved.getReservedQuantity()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(saved.getBloodType()).isEqualTo(bloodType);

        BloodStockDTO dto = service.registerDelivery(20L, req);
        assertThat(dto.getBloodTypeId()).isEqualTo(3L);
        assertThat(dto.getBloodGroupLabel()).isEqualTo("A RhD");
        assertThat(dto.getTotalAvailable()).isNotNull();
    }

}
