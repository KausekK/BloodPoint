package com.point.blood.questionnaire;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuestionnaireQuestionRepository extends JpaRepository<QuestionnaireQuestion, Long> {

    @Query("""
    SELECT new com.point.blood.questionnaire.QuestionDTO(
      q.id,
      q.text,
      q.type,
      qq.orderIndex
    )
    FROM QuestionnaireQuestion qq
    JOIN qq.question q
    WHERE qq.questionnaire.id = :qid
    ORDER BY qq.orderIndex
  """)
    List<QuestionDTO> findByQuestionnaireId(@Param("qid") Integer questionnaireId);
}
