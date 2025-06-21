package com.point.blood.questionnaire.response;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/questionnaire-response")
@AllArgsConstructor
public class QuestionnaireResponseController {

    private final QuestionnaireResponseService service;

    @PostMapping
    public ResponseEntity<Void> submit(@RequestBody QuestionnaireResponseDTO dto) {
        service.saveResponses(dto);
        return ResponseEntity.ok().build();
    }}
