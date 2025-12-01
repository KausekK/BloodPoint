package com.point.blood.donationPoint;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.point.blood.donation.Donation;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

import static jakarta.persistence.FetchType.LAZY;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "blood_donation_point")
public class BloodDonationPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "donation_point_number", nullable = false)
    private Long donationPointNumber;

    @Column(nullable = false)
    private String province;

    @Column(nullable = false)
    private String city;

    @Column(name = "zip_code", nullable = false, length = 10)
    private String zipCode;

    @Column(name = "street", nullable = false)
    private String street;

    @Column(precision = 9, scale = 6, nullable = false)
    @DecimalMin("-90.0") @DecimalMax("90.0")
    private BigDecimal latitude;

    @Column(precision = 10, scale = 6, nullable = false)
    @DecimalMin("-180.0") @DecimalMax("180.0")
    private BigDecimal longitude;


    @Column(name = "phone", nullable = false, length = 15)
    private String phone;


}
