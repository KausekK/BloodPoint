package com.point.blood.BloodRequestStatus;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "BLOOD_REQUEST_STATUS")
public class BloodRequestStatus {

    @Id
    @Column(name = "ID")
    private Long id;

    @Column(name = "TYPE", nullable = false, length = 255)
    private String type;
}