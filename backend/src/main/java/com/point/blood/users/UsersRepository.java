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
                bt.bloodGroup,
                bt.rhFactor,
                d.lastDonationDate,
                COALESCE(SUM(do.amountOfBlood), 0)
              )
              FROM Users u
              JOIN u.donor d
              JOIN d.bloodType bt
              LEFT JOIN d.donations do
              WHERE u.id = :id
              GROUP BY
                u.id,
                u.firstName,
                u.lastName,
                u.email,
                u.pesel,
                bt.bloodGroup,
                bt.rhFactor,
                d.lastDonationDate
            """)
    Optional<UsersProfileDTO> findProfileById(@Param("id") Long id);


    //TODO dodac date urodzenia

}
