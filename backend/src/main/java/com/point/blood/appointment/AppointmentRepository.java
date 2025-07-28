package com.point.blood.appointment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    @Query("""
            SELECT new com.point.blood.appointment.ScheduledAppointmentForUserDTO(
            a.id, u.id, d.startTime, b.city, b.street)
            FROM Appointment a
            JOIN a.users u
            JOIN a.donationTimeSlot d
            JOIN d.bloodDonationPoint b
            WHERE u.id = :userId
            AND d.startTime >= :now
            """)
    Optional<ScheduledAppointmentForUserDTO> findScheduledAppointmentForUserByUserId(@Param("userId") Long userId, @Param("now") LocalDateTime now);

    boolean existsByUsers_Id(Long userId);


    @Query("""
            SELECT new com.point.blood.appointment.AllAppointmentsDetailsDTO(
           a.id, u.id, b.id, u.firstName, u.lastName, u.pesel, u.email,
           d.lastDonationDate, CONCAT(bt.bloodGroup, bt.rhFactor), dts.startTime, a.status
       )
       FROM Appointment a
       JOIN a.users u
       JOIN u.donor d
       JOIN d.donations dont
       JOIN dont.bloodDonationPoint b
       JOIN d.bloodType bt
       JOIN a.donationTimeSlot dts
       WHERE b.id = :bloodDonationPointId
       AND dts.startTime BETWEEN :today AND :tomorrow
       """)
    List<AllAppointmentsDetailsDTO> findAllTodayAppointmentsForBloodPoint(
            @Param("bloodDonationPointId") Long bloodDonationPointId,
            @Param("today") LocalDateTime today,
            @Param("tomorrow") LocalDateTime tomorrow
    );

}

