package com.point.blood.donation;

import com.point.blood.statistics.DonationStatsView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {

@Query("""
        SELECT new com.point.blood.donation.DonationDTO(
               d.id, d.amountOfBlood, d.donationDate, d.donationType.type, bd.city, bd.street)
               FROM Donation d
               join d.bloodDonationPoint bd
               WHERE d.donor.users.id = :userId
        """)
    List<DonationDTO> findAllByDonorUserId(@Param("userId") Long userId);

    @Query("""
        SELECT new com.point.blood.donation.DonationDTO(
               d.id, d.amountOfBlood, d.donationDate, d.donationType.type, bd.city, bd.street)
               FROM Donation d
               join d.bloodDonationPoint bd
               WHERE d.donor.users.id = :userId
               AND d.donationDate BETWEEN :dateFrom AND :dateTo
        """)
    List<DonationDTO> findAllByDonorUserIdAndDate(@Param("userId") Long userId, @Param("dateFrom") LocalDateTime dateFrom, @Param("dateTo") LocalDateTime dateTo);


    @Query(value = """
    WITH base AS (
       SELECT  bt.blood_group AS blood_group,
               bt.rh_factor    AS rh_factor,
               u.gender        AS gender,
               FLOOR(MONTHS_BETWEEN(
                   CAST(d.donation_date AS DATE),
                   CAST(u.date_of_birth AS DATE)
               ) / 12)         AS age_at
       FROM donation d
       JOIN donor      dn ON d.DONOR_USERS_ID = dn.USERS_ID
       JOIN users       u ON dn.USERS_ID = u.id
       JOIN blood_type bt ON dn.blood_type_id = bt.id
       WHERE d.donation_date BETWEEN :dateFrom AND :dateTo
    )
    SELECT  b.blood_group  AS bloodGroup,
            b.rh_factor    AS rhFactor,
            b.gender       AS gender,
            CASE
                WHEN b.age_at < 18 THEN '<18'
                WHEN b.age_at BETWEEN 18 AND 24 THEN '18-24'
                WHEN b.age_at BETWEEN 25 AND 34 THEN '25-34'
                WHEN b.age_at BETWEEN 35 AND 44 THEN '35-44'
                WHEN b.age_at BETWEEN 45 AND 54 THEN '45-54'
                WHEN b.age_at BETWEEN 55 AND 64 THEN '55-64'
                ELSE '65+'
            END            AS ageBucket,
            COUNT(*)       AS donationsCnt
    FROM base b
    GROUP BY b.blood_group, b.rh_factor, b.gender,
             CASE
                WHEN b.age_at < 18 THEN '<18'
                WHEN b.age_at BETWEEN 18 AND 24 THEN '18-24'
                WHEN b.age_at BETWEEN 25 AND 34 THEN '25-34'
                WHEN b.age_at BETWEEN 35 AND 44 THEN '35-44'
                WHEN b.age_at BETWEEN 45 AND 54 THEN '45-54'
                WHEN b.age_at BETWEEN 55 AND 64 THEN '55-64'
                ELSE '65+'
             END
    """, nativeQuery = true)
    List<DonationStatsView> getStats(@Param("dateFrom") LocalDate dateFrom,
                                     @Param("dateTo")   LocalDate dateTo);


}
