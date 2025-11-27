package com.point.blood.bloodRequest;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {

    @Query("""
        SELECT new com.point.blood.bloodRequest.BloodRequestListDTO(
            br.id,
            h.hospitalNumber,
            h.city,
           CONCAT(bt.bloodGroup, bt.rhFactor),
            br.amount,
            s.type,
            br.createdAt
        )
        FROM BloodRequest br
        JOIN br.hospital h
        JOIN br.bloodType bt
        JOIN br.status s
        WHERE UPPER(s.type) = 'NOWA'
        ORDER BY br.createdAt DESC
    """)
    List<BloodRequestListDTO> findAllNewRequests();

    @Query("""
        SELECT new com.point.blood.bloodRequest.BloodRequestListDTO(
            br.id,
            h.hospitalNumber,
            h.city,
           CONCAT(bt.bloodGroup, bt.rhFactor),
            br.amount,
            s.type,
            br.createdAt
        )
        FROM BloodRequest br
        JOIN br.hospital h
        JOIN br.bloodType bt
        JOIN br.status s
        WHERE h.id = :hospitalId
        ORDER BY br.createdAt DESC
    """)
    List<BloodRequestListDTO> findAllHospitalRequests(@Param("hospitalId") Long hospitalId);
}
