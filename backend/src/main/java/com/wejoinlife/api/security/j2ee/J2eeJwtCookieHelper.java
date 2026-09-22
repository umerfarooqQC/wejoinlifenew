package com.wejoinlife.api.security.j2ee;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Production-ready J2EE / Servlet Helper for generating JWT tokens and
 * setting cross-domain Single Sign-On (SSO) cookies.
 *
 * Drop this helper (or equivalent javax.servlet version) into your J2EE application.
 */
public class J2eeJwtCookieHelper {

    // 1. MUST match Spring Boot's application.security.jwt.secret-key
    public static final String SECRET_KEY = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    
    // 2. Cookie name matching Spring Boot's application.security.jwt.cookie-name
    public static final String COOKIE_NAME = "wjl_jwt";

    // 24 Hours in milliseconds
    public static final long EXPIRATION_MS = 86400000L;

    private static SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Generates a signed JWT compatible with Spring Boot's JwtService and JwtAuthenticationFilter.
     */
    public static String generateJwt(
            String email,
            String clientUuid,
            String clientId,
            String role,
            List<Integer> siteIds,
            String profile
    ) {
        Map<String, Object> claims = new java.util.HashMap<>();
        if (clientUuid != null) claims.put("clientUuid", clientUuid);
        if (clientId != null) claims.put("clientId", clientId);
        claims.put("role", role != null ? role : "buyer");
        if (siteIds != null && !siteIds.isEmpty()) {
            claims.put("siteIds", siteIds);
        }
        claims.put("profile", profile != null ? profile : "logged_in_user");

        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(getSignInKey())
                .compact();
    }

    /**
     * Sets the SSO JWT cookie on the HTTP response.
     *
     * @param response HTTP response
     * @param request HTTP request (to detect HTTPS/secure)
     * @param jwt The generated JWT string
     * @param rootDomain Shared parent domain, e.g. ".wejoinlife.com" (use null or "" for localhost)
     * @param httpOnly True for maximum security (XSS protection); false if React must read cookie in JS
     */
    public static void setJwtCookie(
            HttpServletResponse response,
            HttpServletRequest request,
            String jwt,
            String rootDomain,
            boolean httpOnly
    ) {
        StringBuilder cookie = new StringBuilder();
        cookie.append(COOKIE_NAME).append("=").append(jwt).append(";");
        cookie.append(" Path=/;");
        cookie.append(" Max-Age=").append(EXPIRATION_MS / 1000).append(";");

        if (rootDomain != null && !rootDomain.isBlank() && !"localhost".equalsIgnoreCase(rootDomain)) {
            cookie.append(" Domain=").append(rootDomain).append(";");
        }

        cookie.append(" SameSite=Lax;");

        if (httpOnly) {
            cookie.append(" HttpOnly;");
        }

        if (request.isSecure() || "https".equalsIgnoreCase(request.getHeader("X-Forwarded-Proto"))) {
            cookie.append(" Secure;");
        }

        response.addHeader("Set-Cookie", cookie.toString());
    }

    /**
     * Clears the SSO JWT cookie (for logout).
     */
    public static void clearJwtCookie(HttpServletResponse response, String rootDomain) {
        StringBuilder cookie = new StringBuilder();
        cookie.append(COOKIE_NAME).append("=;");
        cookie.append(" Path=/;");
        cookie.append(" Max-Age=0;");

        if (rootDomain != null && !rootDomain.isBlank() && !"localhost".equalsIgnoreCase(rootDomain)) {
            cookie.append(" Domain=").append(rootDomain).append(";");
        }

        cookie.append(" SameSite=Lax;");
        response.addHeader("Set-Cookie", cookie.toString());
    }
}
