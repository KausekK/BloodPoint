package com.point.blood.BloodRequestStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BloodRequestStatusRepository extends JpaRepository<BloodRequestStatus, Long> {
    Optional<BloodRequestStatus> findByTypeIgnoreCase(String type);
}
