package com.point.blood.users;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/user")
@RequiredArgsConstructor
public class UsersController {

    private final UsersService usersService;

    @GetMapping("/profile/{id}")
    public ResponseEntity<UsersProfileDTO> getProfile(@PathVariable Long id) {
        return ResponseEntity.ok(usersService.getUserInfo(id));
    }
}
