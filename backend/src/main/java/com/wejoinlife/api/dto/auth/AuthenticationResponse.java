package com.wejoinlife.api.dto.auth;

import com.wejoinlife.api.dto.user.UserResponse;

public record AuthenticationResponse(
    String token,
    UserResponse user
) {}
