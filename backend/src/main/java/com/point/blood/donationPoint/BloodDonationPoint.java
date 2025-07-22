package com.point.blood.donationPoint;

import com.point.blood.donation.Donation;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @Column(name = "open_hours", nullable = false, length = 100)
    private String openHours; //TODO usunac

    //TODO odkomentowac
//    @Min(value = 0)
//    @Max(value = 24)
//    @Column(name = "open_hour", nullable = false)
//    private Double openHour;
//
//    @Min(value = 0)
//    @Max(value = 24)
//    @Column(name = "close_hour", nullable = false)
//    private Double closeHour;



    @Column(name = "phone", nullable = false, length = 15)
    private String phone;

    @ManyToOne(fetch = LAZY, optional = false)
    @JoinColumn(name = "donation", nullable = false)
    private Donation donation;

}
