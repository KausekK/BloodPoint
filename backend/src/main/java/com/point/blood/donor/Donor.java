package com.point.blood.donor;

import com.point.blood.bloodType.BloodType;
import com.point.blood.donation.Donation;
import com.point.blood.users.Users;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Donor {

        @Id
        @Column(name = "User_id")
        private Long userId;

        @OneToOne(fetch = FetchType.LAZY)
        @MapsId
        @JoinColumn(name = "User_id")
        private Users users;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "Blood_Type_id", nullable = false)
        private BloodType bloodType;


        @Column(name = "last_donation_date", nullable = false)
        private LocalDate lastDonationDate;

        @OneToMany(mappedBy = "donor", cascade = CascadeType.ALL, orphanRemoval = true)
        @Builder.Default
        private Set<Donation> donations = new HashSet<>();

}
