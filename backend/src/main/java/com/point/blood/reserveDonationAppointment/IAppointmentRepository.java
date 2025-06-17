package com.point.blood.reserveDonationAppointment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface IAppointmentRepository extends JpaRepository<Appointment, Integer> {

}
