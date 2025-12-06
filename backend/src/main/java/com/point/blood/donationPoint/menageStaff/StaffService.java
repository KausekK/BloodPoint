package com.point.blood.donationPoint.menageStaff;

import com.point.blood.donationPoint.BloodDonationPoint;
import com.point.blood.donationPoint.BloodDonationPointRepository;
import com.point.blood.role.Role;
import com.point.blood.role.RoleEnum;
import com.point.blood.role.RoleRepository;
import com.point.blood.shared.EditResult;
import com.point.blood.shared.EmailService;
import com.point.blood.shared.MessageDTO;
import com.point.blood.shared.PasswordGenerator;
import com.point.blood.users.Users;
import com.point.blood.users.UsersRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
@Transactional
@RequiredArgsConstructor
public class StaffService {

    private final StaffRepository staffRepository;
    private final StaffMapper staffMapper;
    private final UsersRepository usersRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final BloodDonationPointRepository bloodDonationPointRepository;

    public EditResult<Void> deleteEmployee(Long employeeId) {
        if (!staffRepository.existsById(employeeId)) {
            return EditResult.<Void>builder()
                    .messages(List.of(MessageDTO.createErrorMessage(
                            "Pracownik o id %d nie istnieje.".formatted(employeeId))))
                    .resultDTO(null)
                    .build();
        }

        staffRepository.deleteById(employeeId);

        return EditResult.<Void>builder()
                .messages(List.of(MessageDTO.createSuccessMessage("Pracownik został usunięty.")))
                .resultDTO(null)
                .build();
    }

    public EditResult<StaffDTO> editEmployee(Long staffId, StaffUpdateDTO req) {
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Pracownik o id %d nie istnieje.".formatted(staffId)));

        if (req.getPosition() != null) {
            staff.setPosition(req.getPosition());
        }
        if (req.getEmail() != null && !req.getEmail().isBlank()) {
            staff.getUsers().setEmail(req.getEmail().trim());
        }

        StaffDTO dto = staffMapper.toDto(staff);

        return EditResult.<StaffDTO>builder()
                .messages(List.of(MessageDTO.createSuccessMessage("Dane pracownika zostały zaktualizowane.")))
                .resultDTO(dto)
                .build();
    }

    public EditResult<StaffDTO> createEmployee(Long pointId, StaffCreateDTO req) {

        if (usersRepository.findByEmail(req.getEmail()).isPresent()) {
            return EditResult.<StaffDTO>builder()
                    .messages(List.of(
                            MessageDTO.createErrorMessage("Podany adres e-mail jest już używany przez innego użytkownika.")
                    ))
                    .resultDTO(null)
                    .build();
        }

        BloodDonationPoint point = bloodDonationPointRepository.findById(pointId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Punkt krwiodawstwa nie istnieje: " + pointId));

        Role pointRole = roleRepository.findByName(RoleEnum.PUNKT_KRWIODAWSTWA);

        String rawTempPassword = PasswordGenerator.generate(12);

        Users user = Users.builder()
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .email(req.getEmail())
                .pesel(req.getPesel())
                .phone(req.getPhone())
                .gender(req.getGender())
                .dateOfBirth(req.getBirthDate())
                .password(passwordEncoder.encode(rawTempPassword))
                .roles(Set.of(pointRole))
                .mustChangePassword(true)
                .build();

        Users savedUser = usersRepository.save(user);

        Staff staff = Staff.builder()
                .users(savedUser)
                .employmentStartDay(LocalDate.now())
                .position(req.getPosition())
                .bloodDonationPoint(point)
                .build();

        Staff savedStaff = staffRepository.save(staff);
        StaffDTO dto = staffMapper.toDto(savedStaff);

        try {
            emailService.sendTempPasswordEmail(
                    req.getEmail(),
                    req.getFirstName(),
                    rawTempPassword,
                    "Twoje konto pracownika Punktu Krwiodawstwa",
                    "pracownika punktu krwiodawstwa"
            );
        } catch (Exception e) {
            e.printStackTrace();
        }

        return EditResult.<StaffDTO>builder()
                .resultDTO(dto)
                .messages(List.of(
                        MessageDTO.createSuccessMessage("Pracownik został zarejestrowany. Tymczasowe hasło zostało wygenerowane.")
                ))
                .build();
    }

}
