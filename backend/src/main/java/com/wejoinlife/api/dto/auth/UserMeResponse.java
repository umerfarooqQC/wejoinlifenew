package com.wejoinlife.api.dto.auth;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record UserMeResponse(
        boolean authenticated,
        String accessToken,
        String tokenType,
        String email,
        String role,
        String clientUuid,
        String clientId,
        List<Integer> siteIds,
        String profile
) {
    public static UserMeResponse unauthenticated() {
        return new UserMeResponse(false, null, null, null, null, null, null, List.of(), null);
    }

    public static UserMeResponse authenticated(
            String accessToken,
            String email,
            String role,
            String clientUuid,
            String clientId,
            List<Integer> siteIds,
            String profile
    ) {
        return new UserMeResponse(
                true,
                accessToken,
                accessToken != null ? "Bearer" : null,
                email,
                role,
                clientUuid,
                clientId,
                siteIds != null ? siteIds : List.of(),
                profile
        );
    }
}
