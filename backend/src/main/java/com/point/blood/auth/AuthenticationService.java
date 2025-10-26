package com.point.blood.auth;

import com.point.blood.config.JwtService;
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

        String jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
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
