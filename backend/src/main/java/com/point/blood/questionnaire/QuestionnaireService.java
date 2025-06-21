package com.point.blood.questionnaire;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionnaireService {
    private final QuestionnaireQuestionRepository qqRepo;

    public List<QuestionDTO> getQuestionsFor(Integer questionnaireId) {
        return qqRepo.findByQuestionnaireId(questionnaireId);
    }
}
