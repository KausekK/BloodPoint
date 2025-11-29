package com.point.blood.questionnaire.response;

import com.point.blood.appointment.AppointmentRepository;

import com.point.blood.questionnaire.*;
import com.point.blood.shared.ApplicationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional
@RequiredArgsConstructor
public class QuestionnaireResponseService {

    private final AppointmentRepository appointmentRepository;
    private final QuestionnaireRepository questionnaireRepository;
    private final QuestionRepository questionRepository;
    private final QuestionnaireResponseRepository responseRepository;


    public void saveResponses(QuestionnaireResponseDTO dto) {
        if (dto == null) {
            throw ApplicationException.createWithMessage("Brak danych kwestionariusza.");
        }
        if (dto.getAppointmentId() == null) {
            throw ApplicationException.createWithMessage("Brak identyfikatora wizyty w kwestionariuszu.");
        }
        if (dto.getQuestionnaireId() == null) {
            throw ApplicationException.createWithMessage("Brak identyfikatora kwestionariusza.");
        }
        if (dto.getAnswers() == null || dto.getAnswers().isEmpty()) {
            throw ApplicationException.createWithMessage("Brak odpowiedzi w kwestionariuszu.");
        }

        if (responseRepository.existsByAppointmentId(dto.getAppointmentId())) {
            throw ApplicationException.createWithMessage(
                    "Kwestionariusz dla tej wizyty został już wypełniony.");
        }

        var appointment = appointmentRepository.findById(dto.getAppointmentId())
                .orElseThrow(() -> ApplicationException.createWithMessage(
                        "Nie znaleziono wizyty o id=" + dto.getAppointmentId()));

        Questionnaire questionnaire = questionnaireRepository.findById(dto.getQuestionnaireId())
                .orElseThrow(() -> ApplicationException.createWithMessage(
                        "Nie znaleziono kwestionariusza o id=" + dto.getQuestionnaireId()));

        QuestionnaireResponse session = QuestionnaireResponse.builder()
                .appointment(appointment)
                .questionnaire(questionnaire)
                .build();

        dto.getAnswers().forEach(a -> {
            Question question = questionRepository.findById(a.questionId())
                    .orElseThrow(() -> ApplicationException.createWithMessage(
                            "Nie znaleziono pytania o id=" + a.questionId()));

            Boolean flag = a.answerFlag();

            QuestionResponse qr = QuestionResponse.builder()
                    .question(question)
                    .answerText(a.answerText())
                    .answerFlag(flag)
                    .questionnaireResponse(session)
                    .build();

            session.getResponses().add(qr);
        });

        responseRepository.save(session);
    }
    public boolean hasResponsesForAppointment(Long appointmentId) {
        if (appointmentId == null) {
            throw ApplicationException.createWithMessage("Brak identyfikatora wizyty.");
        }
        return responseRepository.existsByAppointmentId(appointmentId);
    }

    public QuestionnairePreviewDTO getResponsesForAppointment(Long appointmentId) {
        if (appointmentId == null) {
            throw ApplicationException.createWithMessage("Brak identyfikatora wizyty.");
        }

        QuestionnaireResponse qr = responseRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> ApplicationException.createWithMessage(
                        "Kwestionariusz dla tej wizyty nie został wypełniony.")
                );

        var questionnaire = qr.getQuestionnaire();

        var answers = qr.getResponses().stream()
                .map(r -> QuestionnairePreviewDTO.QuestionAnswerPreviewDTO.builder()
                        .questionId(r.getQuestion().getId())
                        .questionText(r.getQuestion().getText())
                        .answerText(r.getAnswerText())
                        .answerFlag(r.getAnswerFlag())
                        .build()
                )
                .toList();

        return QuestionnairePreviewDTO.builder()
                .questionnaireId(questionnaire.getId())
                .questionnaireTitle(questionnaire.getTitle())
                .answers(answers)
                .build();

    }


}
