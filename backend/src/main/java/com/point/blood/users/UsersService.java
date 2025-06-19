package com.point.blood.users;

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
}
