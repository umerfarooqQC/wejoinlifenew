package com.wejoinlife.api.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Value("${application.security.jwt.cookie-name:wjl_jwt}")
    private String jwtCookieName;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        final String uri = request.getRequestURI();
        final String authHeader = request.getHeader("Authorization");
        String jwt = null;
        String source = null;

        // 1. Check Authorization: Bearer <token> header first
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            source = "Authorization header";
            log.info("[JwtFilter] Found token in Authorization Header (length={})", jwt.length());
        } else if (request.getCookies() != null) {
            // Log all incoming cookies for transparent debugging
            StringBuilder cookieList = new StringBuilder();
            for (Cookie cookie : request.getCookies()) {
                cookieList.append(cookie.getName()).append(" (len=").append(cookie.getValue() != null ? cookie.getValue().length() : 0).append("), ");
                if (jwtCookieName.equalsIgnoreCase(cookie.getName()) || 
                    "jwt".equalsIgnoreCase(cookie.getName()) ||
                    "wjl_jwt".equalsIgnoreCase(cookie.getName()) || 
                    "access_token".equalsIgnoreCase(cookie.getName())) {
                    jwt = cookie.getValue();
                    source = "Cookie: " + cookie.getName();
                }
            }
            log.info("[JwtFilter] Incoming Request: {} {} | Cookies received: [{}]", request.getMethod(), uri, cookieList);
            if (jwt != null) {
                log.info("[JwtFilter] Matched JWT from {} (length={})", source, jwt.length());
            } else {
                log.warn("[JwtFilter] No matching JWT cookie found in request for {} {}. Looked for names: [{}, jwt, wjl_jwt, access_token]", 
                        request.getMethod(), uri, jwtCookieName);
            }
        } else {
            log.warn("[JwtFilter] No cookies and no Authorization header received for {} {}", request.getMethod(), uri);
        }

        if (jwt == null || jwt.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            final String userEmail = jwtService.extractUsername(jwt);
            log.info("[JwtFilter] Extracted username/email from token: '{}'", userEmail);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                log.info("[JwtFilter] Loading UserDetails from database for: '{}'", userEmail);
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                
                boolean isValid = jwtService.isTokenValid(jwt, userDetails);
                log.info("[JwtFilter] Token validation result for '{}': {}", userEmail, isValid);

                if (isValid) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    // Attach raw token and claims to request attributes for downstream controllers
                    request.setAttribute("rawJwt", jwt);
                    try {
                        request.setAttribute("jwtClaims", jwtService.extractAllClaims(jwt));
                    } catch (Exception ignored) {
                    }
                    log.info("[JwtFilter] SUCCESS: Authenticated user '{}' with authorities: {}", userEmail, userDetails.getAuthorities());
                } else {
                    log.warn("[JwtFilter] FAILURE: Token is expired or invalid for user '{}'", userEmail);
                }
            }
        } catch (Exception e) {
            log.error("[JwtFilter] ERROR: Authentication failed for {} {}: [{}] {}", 
                    request.getMethod(), uri, e.getClass().getSimpleName(), e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}
