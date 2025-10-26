package com.point.blood.questionnaire.response;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Question_Response")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
@ToString(exclude = "questionnaireResponse")
@EqualsAndHashCode(exclude = "questionnaireResponse")
public class QuestionResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "qresp_seq")
    @SequenceGenerator(name = "qresp_seq", sequenceName = "QUESTION_RESPONSE_SEQ", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "QUESTIONNAIRE_RESPONSE_ID", nullable = false)
    private QuestionnaireResponse questionnaireResponse;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    private com.point.blood.questionnaire.Question question;

    @Column(name = "answer_text", length = 4000)
    private String answerText;

    @Column(name = "answer_flag")
    private Boolean answerFlag;
}
