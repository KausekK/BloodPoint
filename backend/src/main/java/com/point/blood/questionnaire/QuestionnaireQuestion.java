package com.point.blood.questionnaire;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Questionnaire_Question")
public class QuestionnaireQuestion {
    @EmbeddedId
    private QuestionnaireQuestionId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("questionnaireId")
    @JoinColumn(name = "Questionnaire_id", nullable = false)
    private Questionnaire questionnaire;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("questionId")
    @JoinColumn(name = "Question_id", nullable = false)
    private Question question;

    @Column(name = "\"order\"", nullable = false)
    private Integer orderIndex;
}
