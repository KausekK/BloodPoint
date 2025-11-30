package com.point.blood.shared;

import com.point.blood.hospital.Hospital;

public interface EmailService {
    void sendHospitalAccountCreatedEmail(String to, String tempPassword, Hospital hospital);
}
