package com.point.blood.questionnaire.response;

import com.point.blood.appointment.Appointment;
import com.point.blood.donation.Donation;
import com.point.blood.questionnaire.Questionnaire;
import jakarta.persistence.*;

import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "responses")
@EqualsAndHashCode(exclude = "responses")
@Table(name = "questionnaire_response")
public class QuestionnaireResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "qr_seq")
    @SequenceGenerator(
            name = "qr_seq",
            sequenceName = "QUESTIONNAIRE_RESPONSE_SEQ",
            allocationSize = 1
    )
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donation_id")
    private Donation donation;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "questionnaire_id", nullable = false, updatable = false)
    private Questionnaire questionnaire;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "appointment_id", nullable = false, updatable = false)
    private Appointment appointment;

//    @Column(name = "filled_at", nullable = false)
//    private LocalDateTime filledAt;

    @OneToMany(mappedBy = "questionnaireResponse", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<QuestionResponse> responses = new ArrayList<>();
}
