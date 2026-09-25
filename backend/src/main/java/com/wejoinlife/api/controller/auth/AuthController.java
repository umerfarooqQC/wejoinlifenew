package com.wejoinlife.api.controller.auth;

import com.wejoinlife.api.dto.auth.AuthResponse;
import com.wejoinlife.api.dto.auth.LoginRequest;
import com.wejoinlife.api.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

import com.wejoinlife.api.dto.auth.UserMeResponse;
import com.wejoinlife.api.security.JwtService;
import io.jsonwebtoken.Claims;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Map;

@RestController
@RequestMapping({"/wjlapi/api/v1/auth", "/wjlapi/v1/auth", "/api/v1/auth"})
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    @Value("${application.security.jwt.cookie-name:wjl_jwt}")
    private String jwtCookieName;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse httpResponse
    ) {
        AuthService.LoginResult result = authService.login(request);

        // Set cookies only on successful login (status == 0)
        if (result.authResponse().status() == 0) {
            // 1. Set the JWT Cookie (1 day expiry, path = /)
            if (result.authResponse().accessToken() != null) {
                addCookie(httpResponse, jwtCookieName, result.authResponse().accessToken(), Duration.ofDays(1));
            }

            // 2. Set Remember-Me Cookies if requested (identical to JSP login.jsp)
            if (result.rememberMeData() != null) {
                var rme = result.rememberMeData();
                addCookie(httpResponse, "_rme_cuid", rme.cuid(), Duration.ofDays(7));
                addCookie(httpResponse, "_rme_token", rme.token(), Duration.ofDays(7));
                addCookie(httpResponse, "_rme_vld", rme.validator(), Duration.ofDays(7));
            }
        }

        // Return AuthResponse containing the JWT token
        return ResponseEntity.ok(result.authResponse());
    }

    @GetMapping("/me")
    public ResponseEntity<UserMeResponse> getCurrentUser(HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(UserMeResponse.unauthenticated());
        }

        String email = auth.getName();
        String role = auth.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("buyer");

        String clientUuid = null;
        String clientId = null;
        java.util.List<Integer> siteIds = java.util.List.of();
        String profile = null;

        Object claimsObj = request.getAttribute("jwtClaims");
        if (claimsObj instanceof Claims claims) {
            clientUuid = claims.get("clientUuid", String.class);
            Object cid = claims.get("clientId");
            if (cid != null) {
                clientId = cid.toString();
            }
            profile = claims.get("profile", String.class);
            siteIds = jwtService.extractSiteIds(claims);
        }

        String rawJwt = (String) request.getAttribute("rawJwt");

        return ResponseEntity.ok(UserMeResponse.authenticated(
                rawJwt,
                email,
                role,
                clientUuid,
                clientId,
                siteIds,
                profile
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpServletResponse response) {
        // Clear JWT cookie
        addCookie(response, jwtCookieName, "", Duration.ZERO);
        // Clear Remember-Me cookies
        addCookie(response, "_rme_cuid", "", Duration.ZERO);
        addCookie(response, "_rme_token", "", Duration.ZERO);
        addCookie(response, "_rme_vld", "", Duration.ZERO);
        return ResponseEntity.ok(Map.of("status", 0, "message", "Logged out successfully"));
    }

    private void addCookie(HttpServletResponse response, String name, String value, Duration maxAge) {
        ResponseCookie cookie = ResponseCookie.from(name, value)
                .path("/")
                .maxAge(maxAge)
                .httpOnly(false) // Accessible to frontend scripts matching legacy JSP behavior
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}

