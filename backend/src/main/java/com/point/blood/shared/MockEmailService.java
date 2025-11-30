package com.point.blood.shared;

import com.point.blood.hospital.Hospital;
import com.point.blood.shared.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
public class MockEmailService implements EmailService {

    @Override
    public void sendHospitalAccountCreatedEmail(String to, String tempPassword, Hospital hospital) {
        System.out.println("=== MOCK EMAIL: Hospital account created ===");
        System.out.println("To: " + to);
        System.out.println("Hospital ID: " + hospital.getId()
                + ", hospitalNumber: " + hospital.getHospitalNumber());
        System.out.println("Location: " + hospital.getCity()
                + " (" + hospital.getProvince() + ")");
        System.out.println("Street: " + hospital.getStreet());
        System.out.println("Hospital phone: " + hospital.getPhone());
        System.out.println("Temporary password: " + tempPassword);
        System.out.println("=== END MOCK EMAIL ===");
    }
}
