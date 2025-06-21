package com.point.blood.appointment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
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
}
