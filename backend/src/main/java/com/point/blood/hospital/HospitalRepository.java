package com.point.blood.hospital;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {

    @Query("SELECT DISTINCT province FROM Hospital")
    List<String> getHospitalsProvince();


    @Query("""
        SELECT new com.point.blood.hospital.HospitalProfileDTO(
            h.id,
            h.hospitalNumber,
            h.province,
            h.city,
            h.zipCode,
            h.street,
            h.phone
        )
        FROM Hospital h
        WHERE h.id = :hospitalId
    """)
    Optional<HospitalProfileDTO> findProfileById(@Param("hospitalId") Long hospitalId);
}
