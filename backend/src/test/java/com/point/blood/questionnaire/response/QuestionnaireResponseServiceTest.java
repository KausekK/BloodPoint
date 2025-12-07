package com.point.blood.questionnaire.response;

import com.point.blood.appointment.Appointment;
import com.point.blood.appointment.AppointmentRepository;
import com.point.blood.questionnaire.*;
import com.point.blood.shared.ApplicationException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuestionnaireResponseServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private QuestionnaireRepository questionnaireRepository;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private QuestionnaireResponseRepository responseRepository;

    @InjectMocks
    private QuestionnaireResponseService service;

    @Test
    void saveResponses_success_savesResponse() {
        var answer = new QuestionnaireResponseDTO.AnswerDTO(5L, "ans", true);
        var dto = new QuestionnaireResponseDTO(1L, 2L, List.of(answer));

        when(responseRepository.existsByAppointmentId(1L)).thenReturn(false);
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(Appointment.builder().id(1L).build()));
        when(questionnaireRepository.findById(2L)).thenReturn(Optional.of(Questionnaire.builder()
                .id(2L).title("Q").description("D").updatedAt(LocalDateTime.now()).build()));
        when(questionRepository.findById(5L)).thenReturn(Optional.of(Question.builder().id(5L).text("Qtext").type("T").build()));

        service.saveResponses(dto);

        ArgumentCaptor<QuestionnaireResponse> captor = ArgumentCaptor.forClass(QuestionnaireResponse.class);
        verify(responseRepository).save(captor.capture());

        QuestionnaireResponse saved = captor.getValue();
        assertThat(saved.getAppointment()).isNotNull();
        assertThat(saved.getQuestionnaire()).isNotNull();
        assertThat(saved.getResponses()).hasSize(1);
        assertThat(saved.getResponses().getFirst().getAnswerText()).isEqualTo("ans");
    }

    @Test
    void saveResponses_nullDto_throws() {
        assertThatThrownBy(() -> service.saveResponses(null))
                .isInstanceOf(ApplicationException.class)
                .hasMessageContaining("Brak danych kwestionariusza");
    }

    @Test
    void saveResponses_alreadyExists_throws() {
        var dto = new QuestionnaireResponseDTO(1L, 2L, List.of(new QuestionnaireResponseDTO.AnswerDTO(1L, "a", false)));
        when(responseRepository.existsByAppointmentId(1L)).thenReturn(true);

        assertThatThrownBy(() -> service.saveResponses(dto))
                .isInstanceOf(ApplicationException.class)
                .hasMessageContaining("Kwestionariusz dla tej wizyty został już wypełniony");
    }

    @Test
    void hasResponsesForAppointment_null_throws() {
        assertThatThrownBy(() -> service.hasResponsesForAppointment(null))
                .isInstanceOf(ApplicationException.class)
                .hasMessageContaining("Brak identyfikatora wizyty");
    }

    @Test
    void hasResponsesForAppointment_delegates() {
        when(responseRepository.existsByAppointmentId(10L)).thenReturn(true);
        boolean res = service.hasResponsesForAppointment(10L);
        assertThat(res).isTrue();
        verify(responseRepository).existsByAppointmentId(10L);
    }

    @Test
    void getResponsesForAppointment_mapsToPreview() {
        Questionnaire q = Questionnaire.builder().id(7L).title("Survey").description("d").updatedAt(LocalDateTime.now()).build();

        Question question = Question.builder().id(3L).text("How?").type("T").build();

        QuestionResponse qr = QuestionResponse.builder()
                .id(11L)
                .question(question)
                .answerText("yes")
                .answerFlag(true)
                .build();

        QuestionnaireResponse session = QuestionnaireResponse.builder()
                .id(20L)
                .questionnaire(q)
                .appointment(Appointment.builder().id(99L).build())
                .build();
        session.getResponses().add(qr);
        qr.setQuestionnaireResponse(session);

        when(responseRepository.findByAppointmentId(99L)).thenReturn(Optional.of(session));

        QuestionnairePreviewDTO preview = service.getResponsesForAppointment(99L);

        assertThat(preview.getQuestionnaireId()).isEqualTo(7L);
        assertThat(preview.getQuestionnaireTitle()).isEqualTo("Survey");
        assertThat(preview.getAnswers()).hasSize(1);
        var a = preview.getAnswers().getFirst();
        assertThat(a.getQuestionId()).isEqualTo(3L);
        assertThat(a.getQuestionText()).isEqualTo("How?");
        assertThat(a.getAnswerText()).isEqualTo("yes");
        assertThat(a.getAnswerFlag()).isTrue();
    }

    @Test
    void getResponsesForAppointment_notFound_throws() {
        when(responseRepository.findByAppointmentId(5L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.getResponsesForAppointment(5L))
                .isInstanceOf(ApplicationException.class)
                .hasMessageContaining("Kwestionariusz dla tej wizyty nie został wypełniony");
    }

}
