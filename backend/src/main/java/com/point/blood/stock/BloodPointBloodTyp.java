package com.point.blood.stock;

import com.point.blood.bloodType.BloodType;
import com.point.blood.donationPoint.BloodDonationPoint;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "blood_point_blood_typ")
public class BloodPointBloodTyp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "available_quantity", nullable = false,  precision = 12, scale = 3)
    private BigDecimal availableQuantity;

    @Column(name = "reserved_quantity", nullable = false,  precision = 12, scale = 3)
    private BigDecimal reservedQuantity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Blood_donation_point_id", nullable = false)
    private BloodDonationPoint donationPoint;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Blood_type_id", nullable = false)
    private BloodType bloodType;

}
