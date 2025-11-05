package com.point.blood.stock;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class RegisterDeliveryRequest {
    private Long bloodTypeId;
    private BigDecimal liters;
}
