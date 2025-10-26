package com.point.blood.questionnaire.response;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResponseId implements Serializable {

    @Column(name = "Questionnaire_Response_id")
    private Long questionnaireResponseId;

    @Column(name = "Question_id")
    private Long questionId;
}
