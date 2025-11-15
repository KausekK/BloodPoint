package com.point.blood.donationStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DonationStatusRepository extends JpaRepository<DonationStatus, Long> {

    Optional<DonationStatus> findByStatus(DonationStatusEnum status);
}