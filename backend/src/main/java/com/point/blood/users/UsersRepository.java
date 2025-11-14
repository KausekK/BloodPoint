package com.point.blood.users;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {

    @Query("""
              SELECT new com.point.blood.users.UsersProfileDTO(
                u.id,
                u.firstName,
                u.lastName,
                u.email,
                u.pesel,
                u.dateOfBirth,
                u.phone,
                u.gender,
                bt.bloodGroup,
                bt.rhFactor,
                d.lastDonationDate,
            COALESCE(SUM(COALESCE(do.amountOfBlood, 0)), 0)
                )
              FROM Users u
              LEFT JOIN u.donor d
              LEFT JOIN d.bloodType bt
              LEFT JOIN d.donations do
              WHERE u.id = :id
              GROUP BY
                u.id,
                u.firstName,
                u.lastName,
                u.email,
                u.pesel,
                u.dateOfBirth,
                u.phone,
                u.gender,
                bt.bloodGroup,
                bt.rhFactor,
                d.lastDonationDate
            """)
    Optional<UsersProfileDTO> findProfileById(@Param("id") Long id);

    Optional<Users> findByPesel(String pesel);

    Optional<Users> findByEmail(String email);

    Optional<Long> findByHospitalId(Long hospitalId);

    @Query("SELECT h.id FROM Users u LEFT JOIN u.hospital h WHERE u.id = :id")
    Long findHospitalIdById(@Param("id") Long id);
}
