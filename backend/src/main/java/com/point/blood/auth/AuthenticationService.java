package com.point.blood.auth;

import com.point.blood.config.JwtService;
import com.point.blood.donationPoint.menageStaff.StaffRepository;
import com.point.blood.role.Role;
import com.point.blood.role.RoleEnum;
import com.point.blood.role.RoleRepository;
import com.point.blood.shared.EditResult;
import com.point.blood.shared.MessageDTO;
import com.point.blood.users.Users;
import com.point.blood.users.UsersRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.DateTimeException;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthenticationService {

    private final RoleRepository roleRepository;
    private final UsersRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final StaffRepository staffRepository;

    public EditResult<AuthenticationResponse> register(RegisterRequest request) {

        String rawEmail = request.getEmail();
        String normalizedEmail = rawEmail == null ? null : rawEmail.trim().toLowerCase();

        if (normalizedEmail == null || normalizedEmail.isBlank()) {
            return EditResult.<AuthenticationResponse>builder()
                    .messages(java.util.List.of(
                            MessageDTO.createErrorMessage("Podaj email")
                    ))
                    .resultDTO(null)
                    .build();
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            return EditResult.<AuthenticationResponse>builder()
                    .messages(java.util.List.of(
                            MessageDTO.createErrorMessage("Podaj hasło")
                    ))
                    .resultDTO(null)
                    .build();
        }

        if (userRepository.findByEmailIgnoreCase(normalizedEmail).isPresent()) {
            return EditResult.<AuthenticationResponse>builder()
                    .messages(java.util.List.of(
                            MessageDTO.createErrorMessage("Email ma już założone konto. Zaloguj się")
                    ))
                    .resultDTO(null)
                    .build();
        }

        String pesel = request.getPesel();
        if (pesel == null || !pesel.matches("\\d{11}")) {
            return EditResult.<AuthenticationResponse>builder()
                    .messages(java.util.List.of(
                            MessageDTO.createErrorMessage("PESEL musi składać się z 11 cyfr")
                    ))
                    .resultDTO(null)
                    .build();
        }

        LocalDate birthDate = request.getBirthDate();
        if (birthDate == null) {
            return EditResult.<AuthenticationResponse>builder()
                    .messages(java.util.List.of(
                            MessageDTO.createErrorMessage("Podaj datę urodzenia")
                    ))
                    .resultDTO(null)
                    .build();
        }

        LocalDate earliest = LocalDate.of(1910, 1, 1);
        LocalDate today = LocalDate.now();

        if (birthDate.isBefore(earliest) || birthDate.isAfter(today)) {
            return EditResult.<AuthenticationResponse>builder()
                    .messages(java.util.List.of(
                            MessageDTO.createErrorMessage("Data urodzenia musi być między 1910 r. a dniem dzisiejszym")
                    ))
                    .resultDTO(null)
                    .build();
        }

//        if (!isPeselMatchingBirthDate(pesel, birthDate)) {
//            return EditResult.<AuthenticationResponse>builder()
//                    .messages(java.util.List.of(
//                            MessageDTO.createErrorMessage("PESEL nie jest zgodny z datą urodzenia")
//                    ))
//                    .resultDTO(null)
//                    .build();
//        }

        Set<Role> roles = resolveRoles(request);

        Users user = Users.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(normalizedEmail)
                .pesel(pesel)
                .phone(request.getPhone())
                .gender(request.getGender())
                .dateOfBirth(birthDate)
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(roles)
                .build();

        Users saved = userRepository.save(user);

        String jwtToken = jwtService.generateToken(saved);
        AuthenticationResponse authRes = AuthenticationResponse.builder()
                .token(jwtToken)
                .build();

        return EditResult.<AuthenticationResponse>builder()
                .resultDTO(authRes)
                .messages(java.util.List.of(
                        MessageDTO.createSuccessMessage("Użytkownik został utworzony")
                ))
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            throw new IllegalArgumentException("Email and password cannot be null");
        }

        String normalizedEmail = request.getEmail().trim().toLowerCase();
        if (normalizedEmail.isBlank()) {
            throw new IllegalArgumentException("Email cannot be blank");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        normalizedEmail,
                        request.getPassword()
                )
        );

        Users user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Set<String> roleNames = user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(java.util.stream.Collectors.toSet());

        Map<String, Object> claims = new java.util.HashMap<>();
        claims.put("roles", roleNames);
        claims.put("uid", user.getId());

        boolean changePassword = user.isChanged_password();
        claims.put("mcp", changePassword);
        boolean isStaff = roleNames.contains(RoleEnum.PUNKT_KRWIODAWSTWA.name())
                || roleNames.contains(RoleEnum.MANAGER_PUNKTU_KRWIODAWSTWA.name());

        if (isStaff) {
            Long pointId = staffRepository.findPointIdByUserId(user.getId());
            if (pointId == null) {
                throw new IllegalStateException("Staff has no assigned point");
            }
            claims.put("pid", pointId);
        }

        boolean isHospital = roleNames.contains(RoleEnum.SZPITAL.name());
        if (isHospital) {
            Long hospitalId = userRepository.findHospitalIdById(user.getId());
            if (hospitalId == null) {
                throw new IllegalStateException("Hospital not found");
            }
            claims.put("hid", hospitalId);
        }

        String jwtToken = jwtService.generateToken(claims, user);
        System.out.println("=== AUTHENTICATION DEBUG ===");
        System.out.println("User email: " + user.getEmail());
        System.out.println("changed_password (DB): " + user.isChanged_password());
        System.out.println("Roles: " + roleNames);
        System.out.println("============================");

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .userId(user.getId())
                .pointId((Long) claims.get("pid"))
                .hospitalId((Long) claims.get("hid"))
                .roles(roleNames)
                .changedPassword(changePassword)
                .build();
    }

    public EditResult<Void> changePassword(ChangePasswordRequest request, String username) {

        if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank()) {
            return EditResult.<Void>builder()
                    .messages(java.util.List.of(
                            MessageDTO.createErrorMessage("Podaj obecne hasło")
                    ))
                    .resultDTO(null)
                    .build();
        }

        if (request.getNewPassword() == null || request.getNewPassword().isBlank()) {
            return EditResult.<Void>builder()
                    .messages(java.util.List.of(
                            MessageDTO.createErrorMessage("Podaj nowe hasło")
                    ))
                    .resultDTO(null)
                    .build();
        }

        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            return EditResult.<Void>builder()
                    .messages(java.util.List.of(
                            MessageDTO.createErrorMessage("Nowe hasła nie są takie same")
                    ))
                    .resultDTO(null)
                    .build();
        }

        String normalizedUsername = username == null ? null : username.trim().toLowerCase();

        Users user = userRepository.findByEmailIgnoreCase(normalizedUsername)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return EditResult.<Void>builder()
                    .messages(java.util.List.of(
                            MessageDTO.createErrorMessage("Obecne hasło jest nieprawidłowe")
                    ))
                    .resultDTO(null)
                    .build();
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            return EditResult.<Void>builder()
                    .messages(java.util.List.of(
                            MessageDTO.createErrorMessage("Nowe hasło nie może być takie samo jak obecne")
                    ))
                    .resultDTO(null)
                    .build();
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setChanged_password(false);
        userRepository.save(user);

        return EditResult.<Void>builder()
                .messages(java.util.List.of(
                        MessageDTO.createSuccessMessage("Hasło zostało zmienione")
                ))
                .resultDTO(null)
                .build();
    }

    private Set<Role> resolveRoles(RegisterRequest request) {
        RoleEnum roleEnum = (request.getRoleName() != null)
                ? request.getRoleName()
                : RoleEnum.DAWCA;

        Role role = roleRepository.findByName(roleEnum);
        if (role == null) {
            throw new IllegalArgumentException("Unknown role: " + roleEnum);
        }
        return new HashSet<>(Set.of(role));
    }

    private boolean isPeselMatchingBirthDate(String pesel, LocalDate birthDate) {
        if (pesel == null || birthDate == null) return false;
        if (!pesel.matches("\\d{11}")) return false;

        int yy = Integer.parseInt(pesel.substring(0, 2));
        int mmRaw = Integer.parseInt(pesel.substring(2, 4));
        int dd = Integer.parseInt(pesel.substring(4, 6));

        int year;
        int month;

        if (mmRaw >= 1 && mmRaw <= 12) {
            year = 1900 + yy;
            month = mmRaw;
        } else if (mmRaw >= 21 && mmRaw <= 32) {
            year = 2000 + yy;
            month = mmRaw - 20;
        } else {
            return false;
        }

        try {
            LocalDate peselDate = LocalDate.of(year, month, dd);
            return peselDate.equals(birthDate);
        } catch (DateTimeException ex) {
            return false;
        }
    }
}
