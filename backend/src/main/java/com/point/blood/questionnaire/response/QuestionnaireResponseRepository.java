package com.point.blood.questionnaire.response;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QuestionnaireResponseRepository extends JpaRepository<QuestionnaireResponse, Long> {
    Optional<QuestionnaireResponse> findByAppointmentId(Long appointmentId);

    boolean existsByAppointmentId(Long appointmentId);
}
