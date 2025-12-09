package com.point.blood.donor;

import com.point.blood.bloodType.BloodType;
import com.point.blood.donation.Donation;
import com.point.blood.users.Users;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"users", "donations"})
@EqualsAndHashCode(exclude = {"users", "donations"})
public class Donor {

        @Id
        @Column(name = "USERS_ID")
        private Long userId;

        @OneToOne(fetch = FetchType.LAZY)
        @MapsId
        @JoinColumn(name = "USERS_ID")
        private Users users;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "Blood_Type_id", nullable = false)
        private BloodType bloodType;


        @Column(name = "last_donation_date", nullable = true)
        private LocalDate lastDonationDate;

        @OneToMany(mappedBy = "donor", cascade = CascadeType.ALL, orphanRemoval = true)
        @Builder.Default
        private Set<Donation> donations = new HashSet<>();

}
