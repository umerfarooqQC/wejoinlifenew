package com.wejoinlife.api.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JwtAuthenticationFilterTest {

    @Mock
    private UserDetailsService userDetailsService;

    private JwtService jwtService;

    private JwtAuthenticationFilter filter;

    private static final String SECRET_KEY = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

    @BeforeEach
    void setUp() {
        SecurityContextHolder.clearContext();
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", SECRET_KEY);
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", 86400000L);

        filter = new JwtAuthenticationFilter(jwtService, userDetailsService);
        ReflectionTestUtils.setField(filter, "jwtCookieName", "wjl_jwt");
    }

    private String createTestToken(String email, String role) {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        SecretKey key = Keys.hmacShaKeyFor(keyBytes);
        return Jwts.builder()
                .subject(email)
                .claim("role", role)
                .claim("clientUuid", "test-uuid-1234")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 3600000))
                .signWith(key)
                .compact();
    }

    @Test
    void testAuthenticationViaBearerHeader() throws ServletException, IOException {
        String token = createTestToken("buyer@wejoinlife.com", "buyer");
        UserDetails userDetails = new User("buyer@wejoinlife.com", "pass", List.of(new SimpleGrantedAuthority("buyer")));
        when(userDetailsService.loadUserByUsername("buyer@wejoinlife.com")).thenReturn(userDetails);

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer " + token);
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain filterChain = mock(FilterChain.class);

        filter.doFilter(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
        assertEquals("buyer@wejoinlife.com", SecurityContextHolder.getContext().getAuthentication().getName());
        assertEquals(token, request.getAttribute("rawJwt"));
    }

    @Test
    void testAuthenticationViaJwtCookie() throws ServletException, IOException {
        String token = createTestToken("seller@wejoinlife.com", "seller");
        UserDetails userDetails = new User("seller@wejoinlife.com", "pass", List.of(new SimpleGrantedAuthority("seller")));
        when(userDetailsService.loadUserByUsername("seller@wejoinlife.com")).thenReturn(userDetails);

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setCookies(new Cookie("wjl_jwt", token));
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain filterChain = mock(FilterChain.class);

        filter.doFilter(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
        assertEquals("seller@wejoinlife.com", SecurityContextHolder.getContext().getAuthentication().getName());
        assertEquals("seller", SecurityContextHolder.getContext().getAuthentication().getAuthorities().iterator().next().getAuthority());
        assertEquals(token, request.getAttribute("rawJwt"));
    }

    @Test
    void testNoTokenLeavesContextUnauthenticated() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain filterChain = mock(FilterChain.class);

        filter.doFilter(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verifyNoInteractions(userDetailsService);
    }
}
