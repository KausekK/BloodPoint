package com.point.blood.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {
    private String token;
    private Long userId;
    private Long pointId;
    private Long hospitalId;
    private java.util.Set<String> roles;
    private Boolean mustChangePassword;

}
