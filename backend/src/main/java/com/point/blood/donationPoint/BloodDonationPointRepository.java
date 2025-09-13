package com.point.blood.donationPoint;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BloodDonationPointRepository extends JpaRepository<BloodDonationPoint, Long> {

    @Query("SELECT DISTINCT b.city FROM BloodDonationPoint b")
    List<String> getDonationPointCities();

    List<BloodDonationPoint> findByCityIgnoreCaseOrderByStreetAsc(String city);
}
