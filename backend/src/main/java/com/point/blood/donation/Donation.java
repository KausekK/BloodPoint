package com.point.blood.donation;

import com.point.blood.bloodType.BloodType;
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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "donation")
public class Donation {

    @Id
    @SequenceGenerator(
            name = "donation_seq_gen",
            sequenceName = "donation_seq",
            allocationSize = 1
    )
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "donation_seq_gen")
    @Column(name = "id")
    private Long id;

    @Column(name = "amount_of_blood", nullable = false, precision = 4, scale = 2)
    private BigDecimal amountOfBlood;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Blood_Type_id", nullable = false)
    private BloodType bloodType;
}
