package com.point.blood.questionnaire.response;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Question_Response", schema = "BLOODPOINT")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
@ToString(exclude = "questionnaireResponse")
@EqualsAndHashCode(exclude = "questionnaireResponse")
public class QuestionResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "response_id", nullable = false)
    private QuestionnaireResponse questionnaireResponse;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    private com.point.blood.questionnaire.Question question;

    @Column(name = "answer_text", length = 4000)
    private String answerText;

    @Column(name = "answer_flag")
    private Boolean answerFlag;
}
