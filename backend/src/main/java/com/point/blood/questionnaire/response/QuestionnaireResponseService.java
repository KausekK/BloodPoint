package com.point.blood.questionnaire.response;

import com.point.blood.donation.Donation;
import com.point.blood.donation.DonationRepository;
import com.point.blood.questionnaire.Question;
import com.point.blood.questionnaire.QuestionRepository;
import com.point.blood.questionnaire.Questionnaire;
import com.point.blood.questionnaire.QuestionnaireRepository;
import com.point.blood.shared.ApplicationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
@RequiredArgsConstructor
public class QuestionnaireResponseService {

    private final DonationRepository donationRepository;
    private final QuestionnaireRepository questionnaireRepository;
    private final QuestionRepository questionRepository;
    private final QuestionnaireResponseRepository responseRepository;

    public void saveResponses(QuestionnaireResponseDTO dto) {
        Donation donation = donationRepository.findById(dto.getDonationId())
                .orElseThrow(() -> ApplicationException.createWithMessage(
                        "Nie znaleziono wizyty o id=" + dto.getDonationId()));

        Questionnaire questionnaire = questionnaireRepository.findById(dto.getQuestionnaireId())
                .orElseThrow(() -> ApplicationException.createWithMessage(
                        "Nie znaleziono kwestionariusza o id=" + dto.getQuestionnaireId()));

        QuestionnaireResponse session = QuestionnaireResponse.builder()
                .donation(donation)
                .questionnaire(questionnaire)
                .filledAt(LocalDateTime.now())
                .build();

        dto.getAnswers().forEach(a -> {
            Question question = questionRepository.findById(a.questionId())
                    .orElseThrow(() -> ApplicationException.createWithMessage(
                            "Nie znaleziono pytania o id=" + a.questionId()));

            Boolean flag = null;
            if (a.answerFlag() != null) {
                flag = a.answerFlag();
            }

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
}
