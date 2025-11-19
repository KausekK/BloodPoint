package com.point.blood.users;

import com.point.blood.shared.ApplicationException;
import com.point.blood.shared.EditResult;
import com.point.blood.shared.MessageDTO;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


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
        var userEntity = usersRepository.findById(dto.getId())
                .orElseThrow(() -> ApplicationException.createWithMessage(
                        "Brak użytkownika o podanym id: {}", dto.getId()));

        String newEmail = dto.getEmail();

        if (newEmail != null && !newEmail.equalsIgnoreCase(userEntity.getEmail())) {
            var existingOpt = usersRepository.findByEmail(newEmail);

            if (existingOpt.isPresent() && !existingOpt.get().getId().equals(userEntity.getId())) {
                return EditResult.<UsersProfileDTO>builder()
                        .messages(java.util.List.of(
                                MessageDTO.createErrorMessage("Podany adres e-mail jest już używany przez innego użytkownika.")
                        ))
                        .resultDTO(null)
                        .build();
            }
        }

        userEntity.setEmail(newEmail);
        userEntity.setPhone(dto.getPhone());

        var savedUserEntity = usersRepository.save(userEntity);
        var resultDto = UsersProfileDTO.builder()
                .id(savedUserEntity.getId())
                .email(savedUserEntity.getEmail())
                .phone(savedUserEntity.getPhone())
                .build();

        return EditResult.<UsersProfileDTO>builder()
                .resultDTO(resultDto)
                .messages(java.util.List.of(
                        MessageDTO.createSuccessMessage("Zaktualizowano dane kontaktowe.")
                ))
                .build();
    }

}
