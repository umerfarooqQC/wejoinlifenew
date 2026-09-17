package com.wejoinlife.api.dto.auth;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
    @NotBlank(message = "Email or username is required")
    @JsonAlias({"username", "loginid", "loginId"})
    String email,

    @NotBlank(message = "Password is required")
    String password,

    @JsonProperty("rememberMe")
    Boolean rememberMe,

    @JsonProperty("rememberme")
    String remembermeStr,

    String token
) {
    public boolean isRememberMe() {
        if (rememberMe != null && rememberMe) {
            return true;
        }
        return "1".equals(remembermeStr);
    }
}
