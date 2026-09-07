package com.wejoinlife.api.dto.auth;

import jakarta.validation.constraints.NotBlank;

public record AuthenticationRequest(
    @NotBlank(message = "Username/Email/Phone is required")
    String username,

    @NotBlank(message = "Password is required")
    String password
) {}
