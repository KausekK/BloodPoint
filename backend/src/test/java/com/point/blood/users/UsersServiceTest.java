package com.point.blood.users;

import com.point.blood.shared.ApplicationException;
import com.point.blood.shared.EditResult;
import com.point.blood.shared.MessageDTO;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsersServiceTest {

    @Mock
    UsersRepository repository;

    @InjectMocks
    UsersService service;

    @Test
    void getUserInfo_found_returnsProfile() {
        UsersProfileDTO dto = UsersProfileDTO.builder()
                .id(1L)
                .email("a@b.com")
                .phone("123456789")
                .build();

        when(repository.findProfileById(1L)).thenReturn(Optional.of(dto));

        var res = service.getUserInfo(1L);

        assertThat(res).isEqualTo(dto);
        verify(repository).findProfileById(1L);
    }

    @Test
    void getUserInfo_notFound_throws() {
        when(repository.findProfileById(2L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getUserInfo(2L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Uzytkownik nie istnieje");
    }

    @Test
    void updateUserProfileContactInfo_userNotFound_throws() {
        UsersProfileDTO dto = UsersProfileDTO.builder().id(11L).email("x@x.com").phone("111222333").build();
        when(repository.findById(11L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.updateUserProfileContactInfo(dto))
                .isInstanceOf(ApplicationException.class)
                .hasMessageContaining("Brak użytkownika o podanym id");
    }

    @Test
    void updateUserProfileContactInfo_emailAlreadyUsed_returnsErrorResult() {
        Users existing = Users.builder().id(5L).email("old@a.com").phone("000").build();
        Users other = Users.builder().id(9L).email("new@a.com").build();

        UsersProfileDTO dto = UsersProfileDTO.builder().id(5L).email("new@a.com").phone("999").build();

        when(repository.findById(5L)).thenReturn(Optional.of(existing));
        when(repository.findByEmail("new@a.com")).thenReturn(Optional.of(other));

        EditResult<UsersProfileDTO> res = service.updateUserProfileContactInfo(dto);

        assertThat(res.getResultDTO()).isNull();
        assertThat(res.getMessages()).isNotEmpty();
        assertThat(res.hasErrors()).isTrue();
        assertThat(res.getMessages().get(0).getMsg()).contains("Podany adres e-mail jest już używany");
    }

    @Test
    void updateUserProfileContactInfo_success_updatesAndReturns() {
        Users existing = Users.builder().id(6L).email("old@b.com").phone("000").build();
        Users saved = Users.builder().id(6L).email("new@b.com").phone("777").build();

        UsersProfileDTO dto = UsersProfileDTO.builder().id(6L).email("new@b.com").phone("777").build();

        when(repository.findById(6L)).thenReturn(Optional.of(existing));
        when(repository.findByEmail("new@b.com")).thenReturn(Optional.empty());
        when(repository.save(any(Users.class))).thenReturn(saved);

        EditResult<UsersProfileDTO> res = service.updateUserProfileContactInfo(dto);

        assertThat(res.getResultDTO()).isNotNull();
        UsersProfileDTO out = res.getResultDTO();
        assertThat(out.getId()).isEqualTo(6L);
        assertThat(out.getEmail()).isEqualTo("new@b.com");
        assertThat(out.getPhone()).isEqualTo("777");
        assertThat(res.getMessages()).isNotEmpty();
        assertThat(res.getMessages().get(0).getType()).isEqualTo(com.point.blood.shared.MessageTypeEnum.SUCCESS);
    }

}
