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
            LEFT JOIN a.users u
            LEFT JOIN a.donationTimeSlot d
            LEFT JOIN d.bloodDonationPoint b
            WHERE u.id = :userId
            AND d.startTime >= :now
            """)
    Optional<ScheduledAppointmentForUserDTO> findScheduledAppointmentForUserByUserId(@Param("userId") Long userId, @Param("now") LocalDateTime now);

    boolean existsByUsers_Id(Long userId);


    @Query("""
                SELECT DISTINCT new com.point.blood.appointment.AllAppointmentsDetailsDTO(
                    a.id, u.id, b.id, u.firstName, u.lastName, u.pesel, u.email, u.phone, u.gender, u.dateOfBirth,
                    d.lastDonationDate, CONCAT(bt.bloodGroup, bt.rhFactor), dts.startTime, a.status
                )
                FROM Appointment a
                LEFT JOIN a.users u
                LEFT JOIN u.donor d
                LEFT JOIN d.bloodType bt
                LEFT JOIN a.donationTimeSlot dts
                LEFT JOIN dts.bloodDonationPoint b
                WHERE b.id = :bloodDonationPointId
                  AND dts.startTime >= :today AND dts.startTime < :tomorrow
            """)
    List<AllAppointmentsDetailsDTO> findAllTodayAppointmentsForBloodPoint(
            @Param("bloodDonationPointId") Long bloodDonationPointId,
            @Param("today") LocalDateTime today,
            @Param("tomorrow") LocalDateTime tomorrow
    );


}

