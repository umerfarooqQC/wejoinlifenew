package com.wejoinlife.api.dto.auth;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record AuthResponse(
    int status,
    String msg,
    String gotoUrl,
    String rememberme,
    String token,
    String validator,
    String cuid,
    String accessToken,
    String tokenType,
    String email,
    String role
) {
    public static AuthResponse success(
            String jwt,
            String cuid,
            String email,
            String role,
            boolean rememberMe,
            String token,
            String validator
    ) {
        return new AuthResponse(
                0,
                null,
                null,
                rememberMe ? "1" : "0",
                rememberMe ? token : null,
                rememberMe ? validator : null,
                cuid,
                jwt,
                "Bearer",
                email,
                role
        );
    }

    public static AuthResponse error(int status, String msg, String gotoUrl) {
        return new AuthResponse(
                status,
                msg,
                gotoUrl,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
        );
    }
}
