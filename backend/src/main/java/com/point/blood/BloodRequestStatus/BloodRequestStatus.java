package com.point.blood.BloodRequestStatus;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "BLOOD_REQUEST_STATUS")
public class BloodRequestStatus {

    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "type", nullable = false, length = 255)
    private String type;
}