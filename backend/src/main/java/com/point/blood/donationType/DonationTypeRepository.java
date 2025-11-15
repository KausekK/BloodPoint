package com.point.blood.donationType;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DonationTypeRepository extends JpaRepository<DonationType, Long> {

    Optional<DonationType> findByType(DonationTypeEnum type);
}