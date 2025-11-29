package com.point.blood.questionnaire;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionnairePreviewDTO {
    private Long questionnaireId;
    private String questionnaireTitle;
    private List<QuestionAnswerPreviewDTO> answers;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class QuestionAnswerPreviewDTO {
        private Long questionId;
        private String questionText;
        private String answerText;
        private Boolean answerFlag;
    }
}
