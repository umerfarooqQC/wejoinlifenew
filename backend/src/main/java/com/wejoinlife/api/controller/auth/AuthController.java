package com.wejoinlife.api.controller.auth;

import com.wejoinlife.api.dto.auth.AuthResponse;
import com.wejoinlife.api.dto.auth.LoginRequest;
import com.wejoinlife.api.service.AuthService;
import jakarta.servlet.http.Cookie;
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

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Value("${application.cart.cookie-name:vconnect_cart}")
    private String cartCookieName;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse
    ) {
        // Extract cart cookie if present in the incoming request
        String existingCartSession = extractCookieValue(httpRequest, cartCookieName);
        if (existingCartSession == null) {
            existingCartSession = extractCookieValue(httpRequest, "session_id");
        }

        AuthService.LoginResult result = authService.login(request, existingCartSession);

        // Set cookies only on successful login (status == 0)
        if (result.authResponse().status() == 0) {
            // 1. Set the Cart Cookie if present (7 days expiry, path = /)
            if (result.cartSessionId() != null) {
                addCookie(httpResponse, cartCookieName, result.cartSessionId(), Duration.ofDays(7));
            }

            // 2. Set Remember-Me Cookies if requested (identical to JSP login.jsp)
            if (result.rememberMeData() != null) {
                var rme = result.rememberMeData();
                addCookie(httpResponse, "_rme_cuid", rme.cuid(), Duration.ofDays(7));
                addCookie(httpResponse, "_rme_token", rme.token(), Duration.ofDays(7));
                addCookie(httpResponse, "_rme_vld", rme.validator(), Duration.ofDays(7));
            }
        }

        // 3. Return AuthResponse containing the JWT token
        return ResponseEntity.ok(result.authResponse());
    }

    private String extractCookieValue(HttpServletRequest request, String cookieName) {
        if (request.getCookies() == null) {
            return null;
        }
        for (Cookie cookie : request.getCookies()) {
            if (cookieName.equalsIgnoreCase(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
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

