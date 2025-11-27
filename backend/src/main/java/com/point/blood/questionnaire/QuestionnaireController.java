package com.point.blood.questionnaire;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questionnaires")
@RequiredArgsConstructor
public class QuestionnaireController {
    private final QuestionnaireService questionnaireService;
    private final QuestionnaireRepository questionnaireRepository;

    @GetMapping("/{id}/questions")
    public List<QuestionDTO> getQuestions(@PathVariable Long id) {
        return questionnaireService.getQuestionsFor(id);
    }

    @GetMapping("/id")
    public Long getQuestionnaireId(@RequestParam String title) {
        return questionnaireRepository.findQuestionaireIdByQuestionnaireTitle(title);
    }
}
