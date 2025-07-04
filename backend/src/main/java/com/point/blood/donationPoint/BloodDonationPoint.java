package com.point.blood.donationPoint;

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

    @Column(name = "open_hours", nullable = false, length = 100)
    private String openHours;

    @Column(name = "phone", nullable = false, length = 15)
    private String phone;

    //TODO Jak bedzie encja Donation
//       @ManyToOne(fetch = LAZY, optional = false)
//        @JoinColumn(name = "DONATION", nullable = false)
//        private Donation donation;

}
