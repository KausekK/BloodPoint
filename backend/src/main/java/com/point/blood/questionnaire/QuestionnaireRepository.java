package com.point.blood.questionnaire;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionnaireRepository extends JpaRepository<Questionnaire, Long> {

    @Query("SELECT id FROM Questionnaire WHERE title = :questionnaireTitle")
    Long findQuestionaireIdByQuestionnaireTitle(@Param("questionnaireTitle") String questionnaireTitle);


}
