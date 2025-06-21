package com.point.blood.questionnaire.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionnaireResponseDTO {
    Long donationId;
    Long questionnaireId;
    List<AnswerDTO> answers;

    public record AnswerDTO(Long questionId, String answerText, Boolean answerFlag) {}
}
