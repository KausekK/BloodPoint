package com.point.blood.donationPoint.menageStaff;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {

    @Query("select s.bloodDonationPoint.id from Staff s where s.users.id = :userId")
    Long findPointIdByUserId(@Param("userId") Long userId);

//    @Query("""
//        SELECT new com.point.blood.donationPoint.menageStaff.StaffDTO(
//        s.id, u.firstName, u.lastName, u.email,
//         u.pesel, s.employmentStartDay, s.position, bd.id)
//        FROM Staff s
//        JOIN s.users u
//        JOIN s.bloodDonationPoint bd
//        WHERE bd.id = :id
//
//        """)
@Query("""
        SELECT new com.point.blood.donationPoint.menageStaff.StaffDTO(
          u.id,
          u.firstName,
          u.lastName,
          u.email,
          u.phone,
          u.pesel,
          s.employmentStartDay,
          s.position,
          bd.id
        )
        FROM Staff s
        JOIN s.users u
        JOIN s.bloodDonationPoint bd
        WHERE bd.id = :id
        """)
    List<StaffDTO> findAllByBloodDonationPoint_Id(@Param("id") Long id);
}
