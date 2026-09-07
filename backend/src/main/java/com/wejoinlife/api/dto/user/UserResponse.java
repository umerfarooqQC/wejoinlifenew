package com.wejoinlife.api.dto.user;

import com.wejoinlife.api.model.enums.Role;

public record UserResponse(
    String id,
    String email,
    String phone,
    String fullName,
    Role role,
    String status
) {}
