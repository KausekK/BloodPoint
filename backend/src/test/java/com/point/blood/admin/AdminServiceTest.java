package com.point.blood.admin;

import com.point.blood.donationPoint.BloodDonationPoint;
import com.point.blood.donationPoint.BloodDonationPointRepository;
import com.point.blood.donationPoint.menageStaff.Staff;
import com.point.blood.donationPoint.menageStaff.StaffRepository;
import com.point.blood.hospital.Hospital;
import com.point.blood.hospital.HospitalProfileDTO;
import com.point.blood.hospital.HospitalRepository;
import com.point.blood.role.Role;
import com.point.blood.role.RoleEnum;
import com.point.blood.role.RoleRepository;
import com.point.blood.shared.EditResult;
import com.point.blood.shared.EmailService;
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
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private BloodDonationPointRepository bloodDonationPointRepository;

    @Mock
    private UsersRepository usersRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private StaffRepository staffRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private EmailService emailService;

    @Mock
    private HospitalRepository hospitalRepository;

    private AdminService service;

    @Captor
    private ArgumentCaptor<Users> usersCaptor;

    @Captor
    private ArgumentCaptor<String> stringCaptor;

    @BeforeEach
    void setUp() {
        service = new AdminService(bloodDonationPointRepository, usersRepository, roleRepository, staffRepository, passwordEncoder, emailService, hospitalRepository);
    }

    @Test
    void registerDonationPointWithManager_whenEmailExists_returnsError() {
        DonationPointRegisterRequestDTO req = new DonationPointRegisterRequestDTO();
        req.setEmail("existing@ex.com");

        when(usersRepository.findByEmail("existing@ex.com")).thenReturn(Optional.of(Users.builder().id(1L).build()));

        EditResult<Void> res = service.registerDonationPointWithManager(req);

        assertThat(res).isNotNull();
        assertThat(res.hasErrors()).isTrue();
        assertThat(res.getMessages()).isNotEmpty();
        assertThat(res.getMessages().getFirst().getMsg()).contains("Podany e-mail jest już używany");

        verify(usersRepository, never()).save(any());
        verify(bloodDonationPointRepository, never()).save(any());
        verify(staffRepository, never()).save(any());
        verify(emailService, never()).sendTempPasswordEmail(any(), any(), any(), any(), any());
    }

    @Test
    void registerDonationPointWithManager_success_savesEverythingAndSendsEmail() {
        DonationPointRegisterRequestDTO req = new DonationPointRegisterRequestDTO();
        req.setEmail("new@dp.com");
        req.setFirstName("Anna");
        req.setLastName("Nowak");
        req.setContactPhone("123456789");
        req.setPesel("12345678901");
        req.setBirthDate(LocalDate.of(1992,2,2));
        req.setGender(Gender.K);
        req.setProvince("Maz");
        req.setCity("City");
        req.setZipCode("00-001");
        req.setStreet("Street 1");
        req.setPhone("123456789");
        req.setLatitude(BigDecimal.valueOf(12.34));
        req.setLongitude(BigDecimal.valueOf(56.78));

        when(usersRepository.findByEmail("new@dp.com")).thenReturn(Optional.empty());

        Role pointRole = Role.builder().id(3L).name(RoleEnum.PUNKT_KRWIODAWSTWA).build();
        Role managerRole = Role.builder().id(4L).name(RoleEnum.MANAGER_PUNKTU_KRWIODAWSTWA).build();
        when(roleRepository.findByName(RoleEnum.PUNKT_KRWIODAWSTWA)).thenReturn(pointRole);
        when(roleRepository.findByName(RoleEnum.MANAGER_PUNKTU_KRWIODAWSTWA)).thenReturn(managerRole);

        when(passwordEncoder.encode(any())).thenAnswer(invocation -> "encoded:" + invocation.getArgument(0));

        Users savedUser = Users.builder().id(11L).email("new@dp.com").build();
        when(usersRepository.save(any())).thenReturn(savedUser);

        when(bloodDonationPointRepository.getNextDonationPointNumber()).thenReturn(777L);

        BloodDonationPoint savedPoint = BloodDonationPoint.builder().id(22L).donationPointNumber(777L).province("Maz").city("City").zipCode("00-001").street("Street 1").phone("123456789").latitude(BigDecimal.valueOf(12.34)).longitude(BigDecimal.valueOf(56.78)).build();
        when(bloodDonationPointRepository.save(any())).thenReturn(savedPoint);

        when(staffRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        EditResult<Void> res = service.registerDonationPointWithManager(req);

        assertThat(res).isNotNull();
        assertThat(res.hasErrors()).isFalse();
        assertThat(res.getMessages()).isNotEmpty();
        assertThat(res.getMessages().getFirst().getMsg()).contains("Punkt krwiodawstwa został zarejestrowany");

        verify(usersRepository).save(usersCaptor.capture());
        Users captured = usersCaptor.getValue();
        assertThat(captured.getEmail()).isEqualTo("new@dp.com");
        assertThat(captured.getFirstName()).isEqualTo("Anna");
        assertThat(captured.isChanged_password()).isTrue();
        assertThat(captured.getRoles()).hasSize(2);

        verify(passwordEncoder).encode(stringCaptor.capture());
        String rawTemp = stringCaptor.getValue();
        assertThat(rawTemp).hasSize(12);

        verify(emailService).sendTempPasswordEmail(eq("new@dp.com"), eq("Anna"), eq(rawTemp), eq("Twoje konto managera Punktu Krwiodawstwa"), eq("managera punktu krwiodawstwa"));

        verify(bloodDonationPointRepository).save(any(BloodDonationPoint.class));
        verify(staffRepository).save(any(Staff.class));
    }

    @Test
    void registerHospitalWithUser_whenEmailExists_returnsError() {
        HospitalRegisterRequestDTO req = new HospitalRegisterRequestDTO();
        req.setEmail("existing@h.com");

        when(usersRepository.findByEmail("existing@h.com")).thenReturn(Optional.of(Users.builder().id(2L).build()));

        EditResult<HospitalProfileDTO> res = service.registerHospitalWithUser(req);

        assertThat(res).isNotNull();
        assertThat(res.hasErrors()).isTrue();
        assertThat(res.getMessages()).isNotEmpty();
        assertThat(res.getMessages().getFirst().getMsg()).contains("Podany e-mail jest już używany");

        verify(usersRepository, never()).save(any());
        verify(hospitalRepository, never()).save(any());
        verify(emailService, never()).sendTempPasswordEmail(any(), any(), any(), any(), any());
    }

    @Test
    void registerHospitalWithUser_success_savesAndSendsEmail() {
        HospitalRegisterRequestDTO req = new HospitalRegisterRequestDTO();
        req.setEmail("new@h.com");
        req.setFirstName("Piotr");
        req.setLastName("Z");
        req.setContactPhone("987654321");
        req.setPesel("10987654321");
        req.setBirthDate(LocalDate.of(1985,5,5));
        req.setGender(Gender.M);
        req.setProvince("Pom");
        req.setCity("CityH");
        req.setZipCode("11-111");
        req.setStreet("H Street");
        req.setPhone("987654321");

        when(usersRepository.findByEmail("new@h.com")).thenReturn(Optional.empty());

        Role hospitalRole = Role.builder().id(5L).name(RoleEnum.SZPITAL).build();
        when(roleRepository.findByName(RoleEnum.SZPITAL)).thenReturn(hospitalRole);

        when(passwordEncoder.encode(any())).thenAnswer(invocation -> "encoded:" + invocation.getArgument(0));

        Users savedUser = Users.builder().id(77L).email("new@h.com").build();
        when(usersRepository.save(any())).thenReturn(savedUser);

        when(hospitalRepository.getNextHospitalNumber()).thenReturn(333L);

        Hospital savedHospital = Hospital.builder().id(88L).hospitalNumber(333L).province("Pom").city("CityH").zipCode("11-111").street("H Street").phone("987654321").user(savedUser).build();
        when(hospitalRepository.save(any())).thenReturn(savedHospital);

        EditResult<HospitalProfileDTO> res = service.registerHospitalWithUser(req);

        assertThat(res).isNotNull();
        assertThat(res.hasErrors()).isFalse();
        assertThat(res.getResultDTO()).isNotNull();
        HospitalProfileDTO dto = res.getResultDTO();
        assertThat(dto.getId()).isEqualTo(88L);
        assertThat(dto.getHospitalNumber()).isEqualTo(333L);

        verify(usersRepository).save(usersCaptor.capture());
        Users capturedUser = usersCaptor.getValue();
        assertThat(capturedUser.getEmail()).isEqualTo("new@h.com");

        verify(passwordEncoder).encode(stringCaptor.capture());
        String rawTemp = stringCaptor.getValue();
        assertThat(rawTemp).hasSize(12);

        verify(emailService).sendTempPasswordEmail(eq("new@h.com"), eq("Piotr"), eq(rawTemp), eq("Twoje konto Placówki Szpitalnej"), eq("szpital"));
    }
}
