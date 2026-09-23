package com.wejoinlife.api.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

import jakarta.servlet.http.Cookie;
import org.springframework.beans.factory.annotation.Value;

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

        final String authHeader = request.getHeader("Authorization");
        String jwt = null;

        // 1. Check Authorization: Bearer <token> header first
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
        } else if (request.getCookies() != null) {
            // 2. Fallback to extracting from Cookie (for SSO from J2EE / React cross-app navigation)
            for (Cookie cookie : request.getCookies()) {
                if (jwtCookieName.equalsIgnoreCase(cookie.getName()) || 
                    "jwt".equalsIgnoreCase(cookie.getName()) ||
                    "wjl_jwt".equalsIgnoreCase(cookie.getName()) || 
                    "access_token".equalsIgnoreCase(cookie.getName())) {
                    jwt = cookie.getValue();
                    break;
                }
            }
        }

        if (jwt == null || jwt.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            final String userEmail = jwtService.extractUsername(jwt);
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                if (jwtService.isTokenValid(jwt, userDetails)) {
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
                }
            }
        } catch (Exception e) {
            // Log & continue filter chain (Spring Security will handle unauthenticated access)
        }

        filterChain.doFilter(request, response);
    }
}
