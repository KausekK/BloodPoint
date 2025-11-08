package com.point.blood.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http//TODO ustawic dostepy, zmienic permitALl
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/api/blood_stock/**").permitAll()
                        .requestMatchers("/api/profile/**").permitAll()
                        .requestMatchers("/api/forecast/**").permitAll()
                        .requestMatchers("/api/informacje/**").permitAll()
                        .requestMatchers("/api/punkty-krwiodawstwa/**").permitAll()
                        .requestMatchers("/api/krwiodawca/**").permitAll()
                        .requestMatchers("/api/blood-stock/**").permitAll()
                        .requestMatchers("/api/panel/staff/**").permitAll()
                        .requestMatchers("/api/login-info/**").permitAll()
                        .requestMatchers("/api/login/dawca/**").permitAll()
                        .requestMatchers("/api/login/szpital/**").permitAll()
                        .requestMatchers("/api/login/punkt-krwiodawstwa/**").permitAll()
                        .requestMatchers("/api/point/dashboard/**").permitAll()
                        .requestMatchers("/api/user/**").permitAll()
                        .requestMatchers("/api/blood_point/**").permitAll()
                        .requestMatchers("/api/hospital/provinces/**").permitAll()
                        .requestMatchers("/api/statistic/**").permitAll()
                        .requestMatchers("/api/blood-types/**").permitAll()
                        .requestMatchers("/api/request/hospitals/*/requests").permitAll()
                        .requestMatchers("/api/request/**").permitAll()
                        .requestMatchers("/api/zgloszenia/**").permitAll()
                        .requestMatchers("/api/request/*/accept").permitAll()

                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
