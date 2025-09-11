package com.point.blood.questionnaire;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table
@ToString(exclude = "questionnaireLinks")
@EqualsAndHashCode(exclude = "questionnaireLinks")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "question", nullable = false)
    private String text;

    @Column(name = "type", length = 50, nullable = false)
    private String type;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<QuestionnaireQuestion> questionnaireLinks = new ArrayList<>();
}

