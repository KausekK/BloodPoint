package com.point.blood.donationPoint;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BloodDonationPointRepository extends JpaRepository<BloodDonationPoint, Long> {

    @Query("SELECT DISTINCT b.city FROM BloodDonationPoint b")
    List<String> getDonationPointCities();

    @Query("""
        SELECT new com.point.blood.donationPoint.BloodDonationPointDTO(
            b.id, b.city, b.street, b.zipCode, b.phone
        )
        FROM BloodDonationPoint b
        WHERE (:city IS NULL OR :city = '' OR LOWER(b.city) = LOWER(:city))
        ORDER BY b.street ASC
    """)
    List<BloodDonationPointDTO> findPoints(@Param("city") String city);
}
