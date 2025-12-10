package com.point.blood.auth;

import com.point.blood.config.JwtService;
import com.point.blood.donationPoint.menageStaff.StaffRepository;
import com.point.blood.role.Role;
import com.point.blood.role.RoleEnum;
import com.point.blood.role.RoleRepository;
import com.point.blood.shared.EditResult;
import com.point.blood.users.Gender;
import com.point.blood.users.Users;
import com.point.blood.users.UsersRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private UsersRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private StaffRepository staffRepository;

    private AuthenticationService service;

    @Captor
    private ArgumentCaptor<Users> usersCaptor;

    @BeforeEach
    void setUp() {
        service = new AuthenticationService(
                roleRepository,
                userRepository,
                passwordEncoder,
                jwtService,
                authenticationManager,
                staffRepository
        );
    }

    @Test
    void register_missingEmail_returnsError() {
        RegisterRequest req = RegisterRequest.builder()
                .email(null)
                .password("pwd")
                .build();

        EditResult<AuthenticationResponse> res = service.register(req);

        assertThat(res).isNotNull();
        assertThat(res.hasErrors()).isTrue();
        assertThat(res.getMessages().getFirst().getMsg())
                .contains("Podaj email");
    }

    @Test
    void register_emailExists_returnsError() {
        RegisterRequest req = RegisterRequest.builder()
                .email("a@b.com")
                .password("pwd")
                .build();

        when(userRepository.findByEmailIgnoreCase("a@b.com"))
                .thenReturn(Optional.of(Users.builder().id(1L).build()));

        EditResult<AuthenticationResponse> res = service.register(req);

        assertThat(res).isNotNull();
        assertThat(res.hasErrors()).isTrue();
        assertThat(res.getMessages().getFirst().getMsg())
                .contains("Email ma już założone konto");
    }

    @Test
    void register_success_savesUserAndReturnsToken() {
        RegisterRequest req = RegisterRequest.builder()
                .email("new@user.com")
                .password("pass123")
                .firstName("Jan")
                .lastName("K")
                .gender(Gender.M)
                .pesel("90010112345")
                .birthDate(LocalDate.of(1990, 1, 1))
                .phone("123456789")
                .build();

        when(userRepository.findByEmailIgnoreCase("new@user.com"))
                .thenReturn(Optional.empty());

        Role role = Role.builder()
                .id(1L)
                .name(RoleEnum.DAWCA)
                .build();
        when(roleRepository.findByName(RoleEnum.DAWCA))
                .thenReturn(role);

        when(passwordEncoder.encode("pass123"))
                .thenReturn("encodedPass");

        Users saved = Users.builder()
                .id(55L)
                .email("new@user.com")
                .build();
        when(userRepository.save(any()))
                .thenReturn(saved);

        when(jwtService.generateToken(saved))
                .thenReturn("jwt-token");

        EditResult<AuthenticationResponse> res = service.register(req);

        assertThat(res).isNotNull();
        assertThat(res.hasErrors()).isFalse();
        assertThat(res.getResultDTO()).isNotNull();
        assertThat(res.getResultDTO().getToken()).isEqualTo("jwt-token");

        verify(userRepository).save(usersCaptor.capture());
        Users captured = usersCaptor.getValue();
        assertThat(captured.getEmail()).isEqualTo("new@user.com");
        assertThat(captured.getPassword()).isEqualTo("encodedPass");
        assertThat(captured.getPesel()).isEqualTo("90010112345");
        assertThat(captured.getDateOfBirth()).isEqualTo(LocalDate.of(1990, 1, 1));
    }

    @Test
    void authenticate_nullCredentials_throws() {
        AuthenticationRequest req = AuthenticationRequest.builder()
                .email(null)
                .password(null)
                .build();

        assertThrows(IllegalArgumentException.class,
                () -> service.authenticate(req));
    }

    @Test
    void authenticate_userNotFound_throws() {
        AuthenticationRequest req = AuthenticationRequest.builder()
                .email("x@x.com")
                .password("p")
                .build();

        org.springframework.security.core.Authentication mockAuth =
                mock(org.springframework.security.core.Authentication.class);
        doReturn(mockAuth).when(authenticationManager).authenticate(any());

        when(userRepository.findByEmailIgnoreCase("x@x.com"))
                .thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class,
                () -> service.authenticate(req));
    }

    @Test
    void authenticate_staffWithoutPoint_throws() {
        AuthenticationRequest req = AuthenticationRequest.builder()
                .email("s@p.com")
                .password("p")
                .build();

        org.springframework.security.core.Authentication mockAuth =
                mock(org.springframework.security.core.Authentication.class);
        doReturn(mockAuth).when(authenticationManager).authenticate(any());

        Role r = Role.builder()
                .id(2L)
                .name(RoleEnum.PUNKT_KRWIODAWSTWA)
                .build();

        Users user = Users.builder()
                .id(10L)
                .email("s@p.com")
                .roles(Set.of(r))
                .build();

        when(userRepository.findByEmailIgnoreCase("s@p.com"))
                .thenReturn(Optional.of(user));

        // brak przypisanego punktu -> powinno rzucić IllegalStateException
        when(staffRepository.findPointIdByUserId(user.getId()))
                .thenReturn(null);

        assertThrows(IllegalStateException.class,
                () -> service.authenticate(req));
    }

    @Test
    void changePassword_success_updatesPassword() {
        ChangePasswordRequest req = new ChangePasswordRequest();
        req.setCurrentPassword("old");
        req.setNewPassword("newpwd");
        req.setConfirmNewPassword("newpwd");

        Users user = Users.builder()
                .id(20L)
                .email("u@u.com")
                .password("encodedOld")
                .changed_password(true)
                .build();

        when(userRepository.findByEmailIgnoreCase("u@u.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches("old", "encodedOld"))
                .thenReturn(true);
        when(passwordEncoder.matches("newpwd", "encodedOld"))
                .thenReturn(false);
        when(passwordEncoder.encode("newpwd"))
                .thenReturn("encodedNew");

        EditResult<Void> res = service.changePassword(req, "u@u.com");

        assertThat(res).isNotNull();
        assertThat(res.hasErrors()).isFalse();

        verify(userRepository).save(user);
        assertThat(user.getPassword()).isEqualTo("encodedNew");
        assertThat(user.isChanged_password()).isFalse();
    }
}
