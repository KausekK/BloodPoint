package com.point.blood.admin;

import com.point.blood.hospital.Hospital;
import com.point.blood.hospital.HospitalProfileDTO;
import com.point.blood.hospital.HospitalRepository;
import com.point.blood.role.Role;
import com.point.blood.role.RoleEnum;
import com.point.blood.role.RoleRepository;
import com.point.blood.shared.EditResult;
import com.point.blood.shared.EmailService;
import com.point.blood.shared.MessageDTO;
import com.point.blood.shared.PasswordGenerator;
import com.point.blood.users.Users;
import com.point.blood.users.UsersRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminHospitalService {

    private final HospitalRepository hospitalRepository;
    private final UsersRepository usersRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public EditResult<HospitalProfileDTO> registerHospitalWithUser(HospitalRegisterRequestDTO request) {

        if (usersRepository.findByEmail(request.getEmail()).isPresent()) {
            return EditResult.<HospitalProfileDTO>builder()
                    .messages(List.of(MessageDTO.createErrorMessage("Podany e-mail jest już używany przez innego użytkownika.")))
                    .resultDTO(null)
                    .build();
        }


        Role hospitalRole = roleRepository.findByName(RoleEnum.SZPITAL);

        String rawTempPassword = PasswordGenerator.generate(12);

        Users user = Users.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .pesel(request.getPesel())
                .phone(request.getContactPhone())
                .gender(request.getGender())
                .dateOfBirth(request.getBirthDate())
                .password(passwordEncoder.encode(rawTempPassword))
                .roles(Set.of(hospitalRole))
                .mustChangePassword(true)
                .build();

        Users savedUser = usersRepository.save(user);

        Long nextHospitalNumber = hospitalRepository.getNextHospitalNumber();

        Hospital hospital = Hospital.builder()
                .hospitalNumber(nextHospitalNumber)
                .province(request.getProvince())
                .city(request.getCity())
                .zipCode(request.getZipCode())
                .street(request.getStreet())
                .phone(request.getPhone())
                .user(savedUser)
                .build();

        Hospital savedHospital = hospitalRepository.save(hospital);

        System.out.println("=== MOCK EMAIL: Hospital account created ===");
        System.out.println("To: " + request.getEmail());
        System.out.println("Hospital ID: " + savedHospital.getId()
                + ", hospitalNumber: " + savedHospital.getHospitalNumber());
        System.out.println("Location: " + savedHospital.getCity()
                + " (" + savedHospital.getProvince() + ")");
        System.out.println("Street: " + savedHospital.getStreet());
        System.out.println("Hospital phone: " + savedHospital.getPhone());
        System.out.println("Temporary password: " + rawTempPassword);
        System.out.println("=== END MOCK EMAIL ===");

        HospitalProfileDTO dto = HospitalProfileDTO.builder()
                .id(savedHospital.getId())
                .hospitalNumber(savedHospital.getHospitalNumber())
                .province(savedHospital.getProvince())
                .city(savedHospital.getCity())
                .zipCode(savedHospital.getZipCode())
                .street(savedHospital.getStreet())
                .phone(savedHospital.getPhone())
                .build();


        try {
            emailService.sendTempPasswordEmail(
                    request.getEmail(),
                    request.getFirstName(),
                    rawTempPassword,
                    "Twoje konto Placówki Szpitalnej",
                    "szpital"
            );
        } catch (Exception e) {
            e.printStackTrace();
        }

        return EditResult.<HospitalProfileDTO>builder()
                .resultDTO(dto)
                .messages(List.of(MessageDTO.createSuccessMessage("Placówka została zarejestrowana. Tymczasowe hasło zostało wygenerowane (zobacz log serwera).")))
                .build();
    }
}
