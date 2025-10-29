package com.point.blood.auth;

import com.point.blood.config.JwtService;
import com.point.blood.donationPoint.menageStaff.Staff;
import com.point.blood.donationPoint.menageStaff.StaffRepository;
import com.point.blood.role.Role;
import com.point.blood.role.RoleEnum;
import com.point.blood.role.RoleRepository;
import com.point.blood.users.Users;
import com.point.blood.users.UsersRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    public AuthenticationResponse register(RegisterRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email cannot be null");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password cannot be null");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }

        Set<Role> roles = resolveRoles(request);

        Users user = Users.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .pesel(request.getPesel())
                .phone(request.getPhone())
                .gender(request.getGender())
                .dateOfBirth(request.getBirthDate())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(roles)
                .build();

        Users saved = userRepository.save(user);

        String jwtToken = jwtService.generateToken(saved);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            throw new IllegalArgumentException("Email and password cannot be null");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(), request.getPassword()
                )
        );

        Users user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Set<String> roleNames = user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(java.util.stream.Collectors.toSet());

        Map<String, Object> claims = new java.util.HashMap<>();
        claims.put("roles", roleNames);
        claims.put("uid", user.getId());

        boolean isStaff = roleNames.contains(RoleEnum.PUNKT_KRWIODAWSTWA.name());
        if (isStaff) {
            Long pointId = staffRepository.findPointIdByUserId(user.getId());
            if (pointId == null) {
                throw new IllegalStateException("Staff has no assigned point");
            }
            claims.put("pid", pointId);
        }

        String jwtToken = jwtService.generateToken(claims, user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .userId(user.getId())
                .pointId((Long) claims.get("pid"))
                .roles(roleNames)
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
}
