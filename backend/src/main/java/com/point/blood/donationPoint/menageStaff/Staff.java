package com.point.blood.donationPoint.menageStaff;

import com.point.blood.donationPoint.BloodDonationPoint;
import com.point.blood.users.Users;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "staff")
public class Staff {

    @Id
    @Column(name = "users_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, cascade = { CascadeType.MERGE, CascadeType.PERSIST })
    @MapsId
    @JoinColumn(name = "users_id")
    private Users users;

    @Column(name = "employment_start_day", nullable = false)
    private LocalDate employmentStartDay;

    @Column(name = "position", nullable = false)
    @Enumerated(EnumType.STRING)
    private StaffPosition position;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Blood_donation_point_id")
    private BloodDonationPoint bloodDonationPoint;


}
