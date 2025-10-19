package com.point.blood.questionnaire;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/questionnaires")
@RequiredArgsConstructor
public class QuestionnaireController {
    private final QuestionnaireService service;

    @GetMapping("/{id}/questions")
    public List<QuestionDTO> getQuestions(@PathVariable Long id) {
        return service.getQuestionsFor(id);
    }
}
