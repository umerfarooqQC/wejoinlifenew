package com.wejoinlife.api.service;

import com.wejoinlife.api.dto.auth.AuthResponse;
import com.wejoinlife.api.dto.auth.LoginRequest;
import com.wejoinlife.api.model.ClientUser;
import com.wejoinlife.api.repository.AuthRepository;
import com.wejoinlife.api.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthRepository authRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public record RememberMeData(String cuid, String token, String validator) {}
    public record LoginResult(AuthResponse authResponse, String cartSessionId, RememberMeData rememberMeData) {}

    @Transactional
    public LoginResult login(LoginRequest request, String existingCartCookie) {
        // 1. Fetch user from target database
        Optional<ClientUser> userOpt = authRepository.findByEmail(request.email());
        if (userOpt.isEmpty()) {
            return new LoginResult(
                    AuthResponse.error(300, "Username entered does not match any account", null),
                    null,
                    null
            );
        }

        ClientUser user = userOpt.get();

        // 2. Check account verification status
        if (!"1".equals(user.isVerified())) {
            String gotoUrl = "/users/login.jsp?cuid=" + user.clientUuid();
            return new LoginResult(
                    AuthResponse.error(100, "Account not verified", gotoUrl),
                    null,
                    null
            );
        }

        // 3. Verify password (supports BCrypt, SHA-256, and legacy MD5)
        if (!verifyPassword(request.password(), user.pass())) {
            return new LoginResult(
                    AuthResponse.error(200, "The password you have entered is incorrect", null),
                    null,
                    null
            );
        }

        // 4. Update last login timestamp
        authRepository.updateLastLogin(user.id());

        // 5. Handle Cart Cookie logic from JSP
        String cartSessionToSet = handleCartSession(user.id(), existingCartCookie);

        // 6. Handle Remember-Me tokens from JSP
        String lgnToken = null;
        String lgnValidator = null;
        RememberMeData rememberMeData = null;
        if (request.isRememberMe()) {
            lgnToken = UUID.randomUUID().toString();
            lgnValidator = UUID.randomUUID().toString();
            authRepository.saveRememberMeToken(lgnToken, lgnValidator, user.clientUuid());
            rememberMeData = new RememberMeData(user.clientUuid(), lgnToken, lgnValidator);
        }

        // 7. Generate JWT Token
        String role = "1".equals(user.isSuperUser()) ? "ROLE_ADMIN" : "ROLE_BUYER";
        UserDetails userDetails = new User(
                user.email(),
                user.pass(),
                List.of(new SimpleGrantedAuthority(role))
        );

        Map<String, Object> claims = new java.util.HashMap<>();
        if (user.clientUuid() != null) claims.put("clientUuid", user.clientUuid());
        if (user.id() != null) claims.put("clientId", user.id());
        claims.put("profile", user.clientProfilId() != null ? user.clientProfilId() : "logged_in_user");
        String jwt = jwtService.generateToken(claims, userDetails);

        // 8. Construct Success AuthResponse with both JWT and legacy JSP fields
        AuthResponse authResponse = AuthResponse.success(
                jwt,
                user.clientUuid(),
                user.email(),
                role,
                request.isRememberMe(),
                lgnToken,
                lgnValidator
        );

        return new LoginResult(authResponse, cartSessionToSet, rememberMeData);
    }

    private String handleCartSession(String clientId, String guestSessionId) {
        // If user already has a cart in DB, return that cart's session_id to maintain user's cart
        var activeCartSession = authRepository.findActiveCartSession(clientId);
        if (activeCartSession.isPresent()) {
            return activeCartSession.get();
        }

        // If no cart in DB, delete empty carts and link guest cart if one was present
        authRepository.deleteEmptyCarts(clientId);
        if (guestSessionId != null && !guestSessionId.isBlank()) {
            authRepository.assignGuestCartToClient(clientId, guestSessionId);
            return guestSessionId;
        }

        return null;
    }

    private boolean verifyPassword(String rawPassword, String storedHash) {
        if (storedHash == null || storedHash.isBlank()) {
            return false;
        }

        // If password is stored as BCrypt hash
        if (storedHash.startsWith("$2a$") || storedHash.startsWith("$2b$") || storedHash.startsWith("$2y$")) {
            return passwordEncoder.matches(rawPassword, storedHash);
        }

        // SHA-256 verification (64 characters, as stored in devdb vconnect_prod_portal.clients table)
        if (storedHash.length() == 64) {
            try {
                MessageDigest md = MessageDigest.getInstance("SHA-256");
                byte[] digest = md.digest(rawPassword.getBytes(StandardCharsets.UTF_8));
                String sha256Hex = HexFormat.of().formatHex(digest);
                return sha256Hex.equalsIgnoreCase(storedHash);
            } catch (NoSuchAlgorithmException e) {
                throw new RuntimeException("SHA-256 algorithm unavailable", e);
            }
        }

        // Legacy MD5 verification (32 characters, matching JSP pass = md5(?))
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(rawPassword.getBytes(StandardCharsets.UTF_8));
            String md5Hex = HexFormat.of().formatHex(digest);
            return md5Hex.equalsIgnoreCase(storedHash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("MD5 algorithm unavailable", e);
        }
    }
}
