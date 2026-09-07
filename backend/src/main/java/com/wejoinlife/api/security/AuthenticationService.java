package com.wejoinlife.api.security;

import com.wejoinlife.api.dto.auth.AuthenticationRequest;
import com.wejoinlife.api.dto.auth.AuthenticationResponse;
import com.wejoinlife.api.dto.auth.ChangePasswordRequest;
import com.wejoinlife.api.dto.auth.RegisterRequest;
import com.wejoinlife.api.dto.user.UserResponse;
import com.wejoinlife.api.model.User;
import com.wejoinlife.api.model.enums.Role;
import com.wejoinlife.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already registered: " + request.email());
        }

        // Default to BUYER if role is not specified
        Role role = request.role() != null ? request.role() : Role.BUYER;
        
        // Block unauthenticated registration of ADMIN accounts
        if (role == Role.ADMIN) {
            throw new SecurityException("Cannot self-register as ADMIN.");
        }

        User user = User.builder()
                .email(request.email())
                .phone(request.phone())
                .fullName(request.fullName())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(role)
                .status("ACTIVE")
                .build();

        user = userRepository.create(user);

        return buildAuthResponse(user);
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

        return buildAuthResponse(user);
    }

    public UserResponse getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
        return toUserResponse(user);
    }

    public void changePassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Current password is incorrect");
        }

        userRepository.updatePassword(user.getId(), passwordEncoder.encode(request.newPassword()));
    }

    private AuthenticationResponse buildAuthResponse(User user) {
        org.springframework.security.core.userdetails.UserDetails userDetails = 
                org.springframework.security.core.userdetails.User.builder()
                        .username(user.getEmail())
                        .password(user.getPasswordHash())
                        .roles(user.getRole().name())
                        .build();

        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("role", "ROLE_" + user.getRole().name());

        String token = jwtService.generateToken(claims, userDetails);
        return new AuthenticationResponse(token, toUserResponse(user));
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getPhone(),
                user.getFullName(),
                user.getRole(),
                user.getStatus()
        );
    }
}
