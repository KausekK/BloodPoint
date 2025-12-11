package com.point.blood.questionnaire.response;

import com.point.blood.questionnaire.QuestionnairePreviewDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/questionnaires")
@RequiredArgsConstructor
public class QuestionnaireResponseController {

    private final QuestionnaireResponseService questionnaireResponseService;

    @PostMapping("/{questionnaireId}/appointments/{appointmentId}/responses")
    public ResponseEntity<Void> submit(
            @PathVariable Long questionnaireId,
            @PathVariable Long appointmentId,
            @RequestBody QuestionnaireResponseDTO dto
    ) {
        dto.setQuestionnaireId(questionnaireId);
        dto.setAppointmentId(appointmentId);
        questionnaireResponseService.saveResponses(dto);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/appointments/{appointmentId}/responses/status")
    public ResponseEntity<Boolean> getStatus(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(questionnaireResponseService.hasResponsesForAppointment(appointmentId));
    }

    @GetMapping("/appointments/{appointmentId}/responses")
    public QuestionnairePreviewDTO getResponsesForAppointment(
            @PathVariable Long appointmentId
    ) {
        return questionnaireResponseService.getResponsesForAppointment(appointmentId);
    }

}


