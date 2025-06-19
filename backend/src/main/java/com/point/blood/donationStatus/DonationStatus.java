package com.point.blood.donationStatus;

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
@Table(name = "donation_status")
public class DonationStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //TODO jak smieni sie baza to zmienic nazwe na type
    @Column(name = "type", nullable = false)
    @Enumerated(EnumType.STRING)
    private DonationStatusEnum status;
}
