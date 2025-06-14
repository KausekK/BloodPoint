package com.point.blood.ReserveDonationAppointment;

import com.point.blood.MenageDonationPoint.BloodDonationPoint;
import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Donation_Time_Slot")
public class DonationTimeSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Pattern(regexp = "[YN]")
    @Column(name = "available_slot", nullable = false, length = 1)
    private Character availableSlot;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "blood_donation_point_id", nullable = false)
    private BloodDonationPoint bloodDonationPoint;
}
