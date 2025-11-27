package com.point.blood.bloodRequest;

import com.point.blood.BloodRequestStatus.BloodRequestStatus;
import com.point.blood.bloodType.BloodType;
import com.point.blood.hospital.Hospital;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "blood_request")
public class BloodRequest {

    @Id
    @SequenceGenerator(
            name = "blood_request_seq",
            sequenceName = "blood_request_seq",
            allocationSize = 1
    )
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "blood_request_seq")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Hospital_id", nullable = false)
    private Hospital hospital;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Blood_Type_id", nullable = false)
    private BloodType bloodType;

    @Column(name = "amount", nullable = false, precision = 12, scale = 3)
    private BigDecimal amount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Blood_request_status_id", nullable = false)
    private BloodRequestStatus status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

}
