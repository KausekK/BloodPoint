package com.point.blood.donationPoint;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BloodDonationPointRepository extends JpaRepository<BloodDonationPoint, Long> {
}
