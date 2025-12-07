package com.point.blood.donationPoint.menageStaff;

import com.point.blood.donationPoint.BloodDonationPoint;
import com.point.blood.donationPoint.BloodDonationPointRepository;
import com.point.blood.role.Role;
import com.point.blood.role.RoleEnum;
import com.point.blood.role.RoleRepository;
import com.point.blood.shared.EditResult;
import com.point.blood.shared.EmailService;
import com.point.blood.users.Users;
import com.point.blood.users.UsersRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StaffServiceTest {

    @Mock
    StaffRepository staffRepository;

    @Mock
    StaffMapper staffMapper;

    @Mock
    UsersRepository usersRepository;

    @Mock
    RoleRepository roleRepository;

    @Mock
    PasswordEncoder passwordEncoder;

    @Mock
    EmailService emailService;

    @Mock
    BloodDonationPointRepository pointRepository;

    @InjectMocks
    StaffService service;

    @Test
    void deleteEmployee_notExists_returnsErrorResult() {
        when(staffRepository.existsById(5L)).thenReturn(false);

        EditResult<Void> res = service.deleteEmployee(5L);

        assertThat(res.getResultDTO()).isNull();
        assertThat(res.getMessages()).isNotEmpty();
        assertThat(res.hasErrors()).isTrue();
    }

    @Test
    void deleteEmployee_exists_deletesAndReturnsSuccess() {
        when(staffRepository.existsById(3L)).thenReturn(true);

        EditResult<Void> res = service.deleteEmployee(3L);

        verify(staffRepository).deleteById(3L);
        assertThat(res.getMessages()).isNotEmpty();
        assertThat(res.hasErrors()).isFalse();
    }

    @Test
    void editEmployee_notFound_throws() {
        when(staffRepository.findById(10L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.editEmployee(10L, new StaffUpdateDTO()))
                .isInstanceOf(EntityNotFoundException.class);
    }

    @Test
    void editEmployee_updatesFields_andReturnsDto() {
        Users user = Users.builder().id(2L).firstName("Fn").lastName("Ln").email("old@x.com").build();
        Staff staff = Staff.builder().id(2L).users(user).position(StaffPosition.Menadzer).employmentStartDay(LocalDate.now()).build();

        StaffUpdateDTO req = new StaffUpdateDTO(StaffPosition.Pielegniarka, " new@x.com ");

        StaffDTO dto = new StaffDTO(2L, "Fn", "Ln", "new@x.com", "", "", staff.getEmploymentStartDay(), StaffPosition.Pielegniarka, 1L);

        when(staffRepository.findById(2L)).thenReturn(Optional.of(staff));
        when(staffMapper.toDto(staff)).thenReturn(dto);

        EditResult<StaffDTO> res = service.editEmployee(2L, req);

        assertThat(staff.getPosition()).isEqualTo(StaffPosition.Pielegniarka);
        assertThat(staff.getUsers().getEmail()).isEqualTo("new@x.com");
        assertThat(res.getResultDTO()).isEqualTo(dto);
        assertThat(res.getMessages()).isNotEmpty();
    }

    @Test
    void createEmployee_emailAlreadyUsed_returnsError() {
        StaffCreateDTO req = StaffCreateDTO.builder().email("a@a.com").firstName("F").lastName("L").pesel("123").phone("111").birthDate(LocalDate.now()).gender(null).position(StaffPosition.Pielegniarka).build();
        when(usersRepository.findByEmail("a@a.com")).thenReturn(Optional.of(Users.builder().id(9L).email("a@a.com").build()));

        EditResult<StaffDTO> res = service.createEmployee(1L, req);

        assertThat(res.getResultDTO()).isNull();
        assertThat(res.hasErrors()).isTrue();
    }

    @Test
    void createEmployee_pointNotFound_throws() {
        StaffCreateDTO req = StaffCreateDTO.builder().email("b@b.com").firstName("F").lastName("L").pesel("123").phone("111").birthDate(LocalDate.now()).gender(null).position(StaffPosition.Pielegniarka).build();
        when(usersRepository.findByEmail("b@b.com")).thenReturn(Optional.empty());
        when(pointRepository.findById(50L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.createEmployee(50L, req)).isInstanceOf(EntityNotFoundException.class);
    }

    @Test
    void createEmployee_success_savesUserStaff_andSendsEmail() {
        StaffCreateDTO req = StaffCreateDTO.builder().email("c@c.com").firstName("First").lastName("Last").pesel("123").phone("111222333").birthDate(LocalDate.of(1990,1,1)).gender(null).position(StaffPosition.Pielegniarka).build();

        when(usersRepository.findByEmail("c@c.com")).thenReturn(Optional.empty());

        BloodDonationPoint point = BloodDonationPoint.builder().id(77L).build();
        when(pointRepository.findById(77L)).thenReturn(Optional.of(point));

        Role role = Role.builder().id(2L).name(RoleEnum.PUNKT_KRWIODAWSTWA).build();
        when(roleRepository.findByName(RoleEnum.PUNKT_KRWIODAWSTWA)).thenReturn(role);

        when(passwordEncoder.encode(anyString())).thenReturn("encoded");

        Users savedUser = Users.builder().id(200L).firstName(req.getFirstName()).lastName(req.getLastName()).email(req.getEmail()).build();
        when(usersRepository.save(any(Users.class))).thenReturn(savedUser);

        Staff savedStaff = Staff.builder().id(200L).users(savedUser).employmentStartDay(LocalDate.now()).position(req.getPosition()).bloodDonationPoint(point).build();
        when(staffRepository.save(any(Staff.class))).thenReturn(savedStaff);

        StaffDTO dto = new StaffDTO(200L, req.getFirstName(), req.getLastName(), req.getEmail(), req.getPhone(), req.getPesel(), savedStaff.getEmploymentStartDay(), req.getPosition(), 77L);
        when(staffMapper.toDto(savedStaff)).thenReturn(dto);

        ArgumentCaptor<String> tempPassCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> toCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> firstNameCaptor = ArgumentCaptor.forClass(String.class);

        EditResult<StaffDTO> res = service.createEmployee(77L, req);

        verify(usersRepository).save(argThat(u -> "encoded".equals(u.getPassword())));
        verify(staffRepository).save(any(Staff.class));
        verify(emailService).sendTempPasswordEmail(toCaptor.capture(), firstNameCaptor.capture(), tempPassCaptor.capture(), anyString(), anyString());

        assertThat(toCaptor.getValue()).isEqualTo(req.getEmail());
        assertThat(firstNameCaptor.getValue()).isEqualTo(req.getFirstName());
        assertThat(tempPassCaptor.getValue()).isNotNull();
        assertThat(tempPassCaptor.getValue().length()).isEqualTo(12);

        assertThat(res.getResultDTO()).isEqualTo(dto);
        assertThat(res.hasErrors()).isFalse();
    }

}
