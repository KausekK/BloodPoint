package com.point.blood.bloodType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BloodTypeRepository extends JpaRepository<BloodType, Long> {
    Optional<BloodType> findByBloodGroupAndRhFactor(String bloodGroup, Character rhFactor);
}