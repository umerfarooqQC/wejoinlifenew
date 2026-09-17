package com.wejoinlife.api.dto.auth;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

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
    String role,
    @JsonProperty("siteIds")
    @JsonAlias({"site_ids"})
    List<Integer> siteIds
) {
    public static AuthResponse success(
            String jwt,
            String cuid,
            String email,
            String role,
            List<Integer> siteIds,
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
                role,
                siteIds
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
                null,
                null
        );
    }
}