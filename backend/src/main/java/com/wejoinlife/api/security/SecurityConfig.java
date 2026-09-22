package com.wejoinlife.api.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final RateLimitFilter rateLimitFilter;
    private final XssFilter xssFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/error", "/favicon.ico", "/login.html", "/authorized.html").permitAll()
                .requestMatchers("/wjl", "/wjl/", "/wjl/**").permitAll()
                .requestMatchers("/wjlapi/api/v1/auth/**", "/wjlapi/v1/auth/**", "/api/v1/auth/**").permitAll()
                .requestMatchers(
                    "/wjlapi/api/v1/products/**", "/wjlapi/v1/products/**",
                    "/wjlapi/api/v1/adm/**", "/wjlapi/v1/adm/**",
                    "/api/v1/products/**", "/api/v1/adm/**"
                ).permitAll()
                .requestMatchers(
                    "/wjlapi/v1/seller/**", "/wjlapi/api/v1/seller/**",
                    "/v1/seller/**", "/api/v1/seller/**"
                ).permitAll()
                .anyRequest().authenticated()
            )
            // Error handling: Clean JSON responses matching {"detail": {"code": "...", "message": "..."}}
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(401);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"detail\":{\"code\":\"UNAUTHORIZED\",\"message\":\"Full authentication is required to access this resource.\"}}");
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setStatus(403);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"detail\":{\"code\":\"FORBIDDEN\",\"message\":\"You do not have permission to access this resource.\"}}");
                })
            )
            // Security Filter Order
            .addFilterBefore(xssFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(rateLimitFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("http://localhost:[*]", "http://127.0.0.1:[*]", "https://wejoinlife.com"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
