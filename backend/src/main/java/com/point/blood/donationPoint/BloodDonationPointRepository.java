package com.point.blood.donationPoint;

import com.point.blood.hospital.HospitalProfileDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BloodDonationPointRepository extends JpaRepository<BloodDonationPoint, Long> {

    @Query("SELECT DISTINCT b.city FROM BloodDonationPoint b")
    List<String> getDonationPointCities();

    @Query("""
        SELECT new com.point.blood.donationPoint.BloodDonationPointDTO(
            b.id, b.city, b.street, b.zipCode, b.phone, b.latitude, b.longitude
        )
        FROM BloodDonationPoint b
        WHERE (:city IS NULL OR :city = '' OR LOWER(b.city) = LOWER(:city))
        ORDER BY b.street ASC
    """)
    List<BloodDonationPointDTO> findPoints(@Param("city") String city);

    @Query("""
        SELECT new com.point.blood.donationPoint.BloodDonationPointProfileDTO(
            bp.id,
            bp.city,
            bp.province,
            bp.street,
            bp.zipCode,
            bp.phone
        )
        FROM BloodDonationPoint bp
        WHERE bp.id = :id
    """)
    Optional<BloodDonationPointProfileDTO> findProfileById(@Param("id") Long id);

    @Query(value = "SELECT DONATION_POINT_NUMBER_SEQ.NEXTVAL FROM dual", nativeQuery = true)
    Long getNextDonationPointNumber();
}
