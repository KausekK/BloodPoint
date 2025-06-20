package com.point.blood.users;

import com.point.blood.shared.EditResult;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/user")
@RequiredArgsConstructor
public class UsersController {

    private final UsersService usersService;

    @GetMapping("/profile/{id}")
    public ResponseEntity<UsersProfileDTO> getProfile(@PathVariable Long id) {
        return ResponseEntity.ok(usersService.getUserInfo(id));
    }

    @PutMapping("/profile")
    public ResponseEntity<EditResult<UsersProfileDTO>> updateProfile(@RequestBody UsersProfileDTO profileDTO) {
    return ResponseEntity.ok(usersService.updateUserProfileContactInfo(profileDTO));
    }
}
