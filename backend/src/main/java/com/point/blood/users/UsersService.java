package com.point.blood.users;

import com.point.blood.shared.ApplicationException;
import com.point.blood.shared.EditResult;
import com.point.blood.shared.MessageDTO;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
@RequiredArgsConstructor
public class UsersService {

    private final UsersRepository usersRepository;

    public UsersProfileDTO getUserInfo(Long id) {
        return usersRepository
                .findProfileById(id)
                .orElseThrow(() -> new EntityNotFoundException("Uzytkownik nie istnieje: " + id));
    }


    public EditResult<UsersProfileDTO> updateUserProfileContactInfo(UsersProfileDTO dto) {
        var userEnitty = usersRepository.findById(dto.getId())
                .orElseThrow(() -> ApplicationException.createWithMessage("Brak użytkownika o podanym id: {}", dto.getId()));

        userEnitty.setEmail(dto.getEmail());
       userEnitty.setPhone(dto.getPhone());


        var savedUserEntity = usersRepository.save(userEnitty);
        var resultDto = UsersProfileDTO.builder()
                .id(savedUserEntity.getId())
                .email(savedUserEntity.getEmail())
                .phone(savedUserEntity.getPhone())
                .build();

        return EditResult.<UsersProfileDTO>builder()
                .resultDTO(resultDto)
                .messages(List.of(
                        MessageDTO.createSuccessMessage("Zaaktualizowano dane kontaktowe")
                ))
                .build();
    }
}
