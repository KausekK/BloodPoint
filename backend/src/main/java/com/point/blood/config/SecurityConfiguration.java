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
                        .requestMatchers("/api/profile/**").authenticated()
                        .requestMatchers("/api/forecast/**").authenticated()
                        .requestMatchers("/api/informacje/**").permitAll()
                        .requestMatchers("/api/punkty-krwiodawstwa/**").permitAll()
                        .requestMatchers("/api/krwiodawca/**").authenticated()
                        .requestMatchers("/api/panel/staff/**").authenticated()
                        .requestMatchers("/api/login-info/**").permitAll()
                        .requestMatchers("/api/login/dawca/**").permitAll()
                        .requestMatchers("/api/login/szpital/**").permitAll()
                        .requestMatchers("/api/login/punkt-krwiodawstwa/**").permitAll()
                        .requestMatchers("/api/point/dashboard/**").authenticated()
                        .requestMatchers("/api/user/**").authenticated()
                        .requestMatchers("/api/blood_point/**").permitAll()
                        .requestMatchers("/api/hospital/provinces/**").permitAll()
                        .requestMatchers("/api/statistic/**").authenticated()
                        .requestMatchers("/api/blood-types/**").permitAll()
                        .requestMatchers("/api/request/hospitals/*/requests").authenticated()
                        .requestMatchers("/api/request/**").authenticated()
                        .requestMatchers("/api/zgloszenia/**").authenticated()
                        .requestMatchers("/api/request/*/accept").authenticated()
                        .requestMatchers("/api/questionnaires/**").authenticated()

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
