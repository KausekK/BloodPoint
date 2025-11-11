package com.point.blood.questionnaire;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionnaireService {
    private final QuestionnaireQuestionRepository questionnaireQuestionRepository;

    public List<QuestionDTO> getQuestionsFor(Long questionnaireId) {
        return questionnaireQuestionRepository.findByQuestionnaireId(questionnaireId);
    }
}
