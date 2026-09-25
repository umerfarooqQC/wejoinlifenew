package com.wejoinlife.api.controller.auth;

import com.wejoinlife.api.dto.auth.UserMeResponse;
import com.wejoinlife.api.security.JwtService;
import com.wejoinlife.api.service.AuthService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @Mock
    private JwtService jwtService;

    private AuthController authController;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.clearContext();
        authController = new AuthController(authService, jwtService);
        ReflectionTestUtils.setField(authController, "jwtCookieName", "wjl_jwt");
    }

    @Test
    void testGetCurrentUserUnauthenticatedReturns401() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        ResponseEntity<UserMeResponse> response = authController.getCurrentUser(request);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().authenticated());
    }

    @Test
    void testGetCurrentUserAuthenticatedReturns200() {
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                "testuser@wejoinlife.com",
                null,
                List.of(new SimpleGrantedAuthority("seller"))
        );
        SecurityContextHolder.getContext().setAuthentication(auth);

        Claims mockClaims = mock(Claims.class);
        when(mockClaims.get("clientUuid", String.class)).thenReturn("uuid-999");
        when(mockClaims.get("clientId")).thenReturn("42");
        when(mockClaims.get("profile", String.class)).thenReturn("seller_profile");
        when(jwtService.extractSiteIds(mockClaims)).thenReturn(List.of(101, 102));

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setAttribute("jwtClaims", mockClaims);
        request.setAttribute("rawJwt", "mock-jwt-token-12345");

        ResponseEntity<UserMeResponse> response = authController.getCurrentUser(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        UserMeResponse body = response.getBody();
        assertNotNull(body);
        assertTrue(body.authenticated());
        assertEquals("mock-jwt-token-12345", body.accessToken());
        assertEquals("Bearer", body.tokenType());
        assertEquals("testuser@wejoinlife.com", body.email());
        assertEquals("seller", body.role());
        assertEquals("uuid-999", body.clientUuid());
        assertEquals("42", body.clientId());
        assertEquals(List.of(101, 102), body.siteIds());
    }

    @Test
    void testLogoutClearsCookies() {
        MockHttpServletResponse response = new MockHttpServletResponse();
        ResponseEntity<Map<String, Object>> result = authController.logout(response);

        assertEquals(HttpStatus.OK, result.getStatusCode());
        List<String> setCookies = response.getHeaders("Set-Cookie");
        assertFalse(setCookies.isEmpty());
        // Verify wjl_jwt Max-Age is 0 (cleared)
        assertTrue(setCookies.stream().anyMatch(c -> c.contains("wjl_jwt=") && c.contains("Max-Age=0")));
    }
}
