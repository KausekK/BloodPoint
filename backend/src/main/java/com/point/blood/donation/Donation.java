package com.point.blood.donation;

import com.point.blood.donationPoint.BloodDonationPoint;
import com.point.blood.donationStatus.DonationStatus;
import com.point.blood.donationType.DonationType;
import com.point.blood.donor.Donor;
import com.point.blood.questionnaire.Questionnaire;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
// TODO WAZNE ZMIENIC ILOSC
    @Column(name = "amount_of_blood", nullable = false)
    private Double amountOfBlood;

    @Column(name = "donation_date", nullable = false)
    private LocalDateTime donationDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Donation_Type_id", nullable = false)
    private DonationType donationType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Blood_Donation_Point_id", nullable = false)
    private BloodDonationPoint bloodDonationPoint;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Donation_Status_id", nullable = false)
    private DonationStatus donationStatus;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Questionnaire_id", nullable = false)
    private Questionnaire questionnaire;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Donor_Users_id", nullable = false)
    private Donor donor;
}
