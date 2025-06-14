package com.point.blood.ReserveDonationAppointment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IDonationTimeSlotRepository extends JpaRepository<DonationTimeSlot, Long> {

    @Query("""
                    select new com.point.blood.ReserveDonationAppointment.SlotDTO(
                            s.id, s.startTime, s.endTime, p.city, p.province, p.street)
                 from   DonationTimeSlot s
                 join s.bloodDonationPoint p
                 where  s.availableSlot = 'Y'
                 and p.city = :city
                 and  s.startTime >= :from              
              and  s.startTime <  :to             
            """)
    Page<SlotDTO> findAvailableSlotsForCityAndDay(@Param("city") String city, @Param("from") LocalDateTime from,
                                                  @Param("to") LocalDateTime to, Pageable pageable);

}
