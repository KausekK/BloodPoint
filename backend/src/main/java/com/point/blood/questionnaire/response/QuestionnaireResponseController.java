package com.point.blood.questionnaire.response;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/questionnaires")
@AllArgsConstructor
public class QuestionnaireResponseController {

    private final QuestionnaireResponseService service;

//    @PostMapping("/{questionnaireId}/responses")
//    public ResponseEntity<Void> submit(@RequestBody QuestionnaireResponseDTO dto) {
//        service.saveResponses(dto);
//        return ResponseEntity.ok().build();
//    }

    @PostMapping("/{questionnaireId}/appointments/{appointmentId}/responses")
    public ResponseEntity<Void> submit(
            @PathVariable Long questionnaireId,
            @PathVariable Long appointmentId,
            @RequestBody QuestionnaireResponseDTO dto
    ) {
        dto.setQuestionnaireId(questionnaireId);
        dto.setAppointmentId(appointmentId);
        service.saveResponses(dto);
        return ResponseEntity.ok().build();
    }


}


