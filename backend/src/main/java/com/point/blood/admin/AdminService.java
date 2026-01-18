package com.point.blood.admin;

import com.point.blood.donationPoint.BloodDonationPoint;
import com.point.blood.donationPoint.BloodDonationPointRepository;
import com.point.blood.donationPoint.menageStaff.Staff;
import com.point.blood.donationPoint.menageStaff.StaffPosition;
import com.point.blood.donationPoint.menageStaff.StaffRepository;
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
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminService {

    private final BloodDonationPointRepository bloodDonationPointRepository;
    private final UsersRepository usersRepository;
    private final RoleRepository roleRepository;
    private final StaffRepository staffRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final HospitalRepository hospitalRepository;

    public EditResult<Void> registerDonationPointWithManager(DonationPointRegisterRequestDTO request) {

        if (usersRepository.findByEmail(request.getEmail()).isPresent()) {
            return EditResult.<Void>builder()
                    .messages(List.of(MessageDTO.createErrorMessage("Podany e-mail jest już używany przez innego użytkownika.")))
                    .resultDTO(null)
                    .build();
        }
        if (usersRepository.findByPesel(request.getPesel()).isPresent()) {
            return EditResult.<Void>builder()
                    .messages(List.of(MessageDTO.createErrorMessage("Podany pesel jest już przypisany do innego użytkownika.")))
                    .resultDTO(null)
                    .build();
        }


        Role pointRole = roleRepository.findByName(RoleEnum.PUNKT_KRWIODAWSTWA);
        Role managerRole = roleRepository.findByName(RoleEnum.MANAGER_PUNKTU_KRWIODAWSTWA);

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
                .roles(Set.of(pointRole, managerRole))
                .changed_password(true)
                .build();

        Users savedUser;
        try {
            savedUser = usersRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            return EditResult.<Void>builder()
                    .messages(List.of(
                            MessageDTO.createErrorMessage(
                                    "Podany e-mail lub PESEL jest już używany."
                            )
                    ))
                    .resultDTO(null)
                    .build();
        }

        Long nextNumber = bloodDonationPointRepository.getNextDonationPointNumber();

        BloodDonationPoint point = BloodDonationPoint.builder()
                .donationPointNumber(nextNumber)
                .province(request.getProvince())
                .city(request.getCity())
                .zipCode(request.getZipCode())
                .street(request.getStreet())
                .phone(request.getPhone())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .build();

        BloodDonationPoint savedPoint = bloodDonationPointRepository.save(point);

        Staff staff = Staff.builder()
                .users(savedUser)
                .employmentStartDay(LocalDate.now())
                .position(StaffPosition.Menadzer)
                .bloodDonationPoint(savedPoint)
                .build();

        staffRepository.save(staff);

        try {
            emailService.sendTempPasswordEmail(
                    request.getEmail(),
                    request.getFirstName(),
                    rawTempPassword,
                    "Twoje konto managera Punktu Krwiodawstwa",
                    "managera punktu krwiodawstwa"
            );
        } catch (Exception e) {
            e.printStackTrace();
        }

        return EditResult.<Void>builder()
                .messages(List.of(MessageDTO.createSuccessMessage("Punkt krwiodawstwa został zarejestrowany. Tymczasowe hasło zostało wygenerowane.")))
                .resultDTO(null)
                .build();
    }

    public EditResult<HospitalProfileDTO> registerHospitalWithUser(HospitalRegisterRequestDTO request) {

        if (usersRepository.findByEmail(request.getEmail()).isPresent()) {
            return EditResult.<HospitalProfileDTO>builder()
                    .messages(List.of(MessageDTO.createErrorMessage("Podany e-mail jest już używany przez innego użytkownika.")))
                    .resultDTO(null)
                    .build();
        }
        if (usersRepository.findByPesel(request.getPesel()).isPresent()) {
            return EditResult.<HospitalProfileDTO>builder()
                    .messages(List.of(MessageDTO.createErrorMessage("Podany pesel jest już przypisany do innego użytkownika.")))
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
                .changed_password(true)
                .build();

        Users savedUser;
        try {
            savedUser = usersRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            return EditResult.<HospitalProfileDTO>builder()
                    .messages(List.of(
                            MessageDTO.createErrorMessage(
                                    "Podany e-mail lub PESEL jest już używany."
                            )
                    ))
                    .resultDTO(null)
                    .build();
        }

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
                .messages(List.of(MessageDTO.createSuccessMessage("Placówka została zarejestrowana. Tymczasowe hasło zostało wygenerowane.")))
                .build();
    }
}
