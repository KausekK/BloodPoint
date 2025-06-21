package com.point.blood.stock;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BloodStockRepository extends JpaRepository<BloodPointBloodTyp, Long> {


    @Query("""
              SELECT new com.point.blood.stock.BloodStockDTO(
                CONCAT(bt.bloodGroup, bt.rhFactor),
                SUM(bpbt.availableQuantity),
                SUM(bpbt.reservedQuantity),
                SUM(bpbt.availableQuantity - bpbt.reservedQuantity)
              )
              FROM BloodPointBloodTyp bpbt
              JOIN bpbt.bloodType bt
              GROUP BY bt.bloodGroup, bt.rhFactor
              ORDER BY bt.bloodGroup, bt.rhFactor
            """)
    List<BloodStockDTO> findTotalStockByBloodType();

}
