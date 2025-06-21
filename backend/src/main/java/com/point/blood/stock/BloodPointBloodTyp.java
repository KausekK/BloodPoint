package com.point.blood.stock;

import com.point.blood.bloodType.BloodType;
import com.point.blood.donationPoint.BloodDonationPoint;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @Column(name = "available_quantity", nullable = false)
    private Integer availableQuantity;

    @Column(name = "reserved_quantity", nullable = false)
    private Integer reservedQuantity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blood_donation_point_id", nullable = false)
    private BloodDonationPoint donationPoint;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blood_type_id", nullable = false)
    private BloodType bloodType;

}
