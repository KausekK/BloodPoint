package com.point.blood.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.lang.reflect.Field;
import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    private JwtService jwtService;
    private String secretKey;
    private byte[] keyBytes;

    @BeforeEach
    void setUp() throws Exception {
        jwtService = new JwtService();
        byte[] raw = "01234567890123456789012345678901".getBytes();
        secretKey = Base64.getEncoder().encodeToString(raw);
        keyBytes = raw;

        Field f = JwtService.class.getDeclaredField("secretKey");
        f.setAccessible(true);
        f.set(jwtService, secretKey);
    }

    @Test
    void generateToken_and_extractUsername_and_isTokenValid() {
        UserDetails user = User.withUsername("user@example.com").password("pw").roles("DAWCA").build();

        String token = jwtService.generateToken(user);

        assertThat(token).isNotBlank();
        assertThat(jwtService.extractUsername(token)).isEqualTo(user.getUsername());
        assertThat(jwtService.isTokenValid(token, user)).isTrue();
    }

    @Test
    void generateToken_withExtraClaims_extractPointId() {
        UserDetails user = User.withUsername("u2@example.com").password("pw").roles("DAWCA").build();

        String token = jwtService.generateToken(Map.of("pid", 123L), user);

        assertThat(token).isNotBlank();
        Long pid = jwtService.extractPointId(token);
        assertThat(pid).isEqualTo(123L);
    }

    @Test
    void isTokenValid_returnsFalse_forExpiredToken() {
        UserDetails user = User.withUsername("expired@example.com").password("pw").roles("DAWCA").build();

        Key key = Keys.hmacShaKeyFor(keyBytes);

        String expired = Jwts.builder()
                .setSubject(user.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis() - 2000))
                .setExpiration(new Date(System.currentTimeMillis() - 1000))
                .signWith(key)
                .compact();

        org.junit.jupiter.api.Assertions.assertThrows(io.jsonwebtoken.ExpiredJwtException.class,
                () -> jwtService.isTokenValid(expired, user));
    }
}
