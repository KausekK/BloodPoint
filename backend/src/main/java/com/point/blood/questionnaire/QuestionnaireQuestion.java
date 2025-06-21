package com.point.blood.questionnaire;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "question")
@EqualsAndHashCode(exclude = "question")
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
