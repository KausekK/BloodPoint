package com.point.blood.donationTimeSlot;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface DonationTimeSlotRepository extends JpaRepository<DonationTimeSlot, Long> {

    @Query("""
        select new com.point.blood.donationTimeSlot.DonationTimeSlotDTO(
                s.id, s.startTime, s.endTime, p.city, p.province, p.street)
        from DonationTimeSlot s
        join s.bloodDonationPoint p
        where s.availableSlot = true
          and p.city = :city
          and s.startTime >= :from and s.startTime < :to
          and s.startTime > :now
    """)
    Page<DonationTimeSlotDTO> findAvailableSlotsForCityAndDay(
            @Param("city") String city,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            @Param("now") LocalDateTime now,
            Pageable pageable
    );

    Optional<DonationTimeSlot> findById(Long id);

}
