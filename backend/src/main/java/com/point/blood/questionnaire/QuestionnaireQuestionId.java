package com.point.blood.questionnaire;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionnaireQuestionId {
    private Long questionnaireId;
    private Long questionId;
}
