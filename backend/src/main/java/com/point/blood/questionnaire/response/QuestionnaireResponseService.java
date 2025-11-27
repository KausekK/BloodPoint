package com.point.blood.questionnaire.response;

import com.point.blood.appointment.AppointmentRepository;

import com.point.blood.questionnaire.Question;
import com.point.blood.questionnaire.QuestionRepository;
import com.point.blood.questionnaire.Questionnaire;
import com.point.blood.questionnaire.QuestionnaireRepository;
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

}
