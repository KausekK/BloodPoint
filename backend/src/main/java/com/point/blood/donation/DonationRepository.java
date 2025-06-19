package com.point.blood.donation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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

}
