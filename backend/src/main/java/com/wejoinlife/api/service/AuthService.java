package com.wejoinlife.api.service;

import com.wejoinlife.api.dto.auth.AuthResponse;
import com.wejoinlife.api.dto.auth.LoginRequest;
import com.wejoinlife.api.model.ClientUser;
import com.wejoinlife.api.repository.AuthRepository;
import com.wejoinlife.api.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthRepository authRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Value("${application.security.client-pass-salt:38fc4120}")
    private String clientPassSalt;

    public record RememberMeData(String cuid, String token, String validator) {}
    public record LoginResult(AuthResponse authResponse, RememberMeData rememberMeData) {}

    @Transactional
    public LoginResult login(LoginRequest request) {
        // 1. Fetch user from target database
        Optional<ClientUser> userOpt = authRepository.findByEmailOrUsername(request.email());
        if (userOpt.isEmpty()) {
            return new LoginResult(
                    AuthResponse.error(300, "Username entered does not match any account", null),
                    null
            );
        }

        ClientUser user = userOpt.get();

        // 2. Check account verification status
        if (!"1".equals(user.isVerified())) {
            String gotoUrl = "/users/login.jsp?cuid=" + user.clientUuid();
            return new LoginResult(
                    AuthResponse.error(100, "Account not verified", gotoUrl),
                    null
            );
        }

        // 3. Verify password (supports salted SHA-256 with clientUuid, plain SHA-256, BCrypt, and MD5)
        if (!verifyPassword(request.password(), user.pass(), user.clientUuid())) {
            return new LoginResult(
                    AuthResponse.error(200, "The password you have entered is incorrect", null),
                    null
            );
        }

        // 4. Update last login timestamp
        authRepository.updateLastLogin(user.id());

        // 5. Handle Remember-Me tokens from JSP
        String lgnToken = null;
        String lgnValidator = null;
        RememberMeData rememberMeData = null;
        if (request.isRememberMe()) {
            lgnToken = UUID.randomUUID().toString();
            lgnValidator = UUID.randomUUID().toString();
            authRepository.saveRememberMeToken(lgnToken, lgnValidator, user.clientUuid());
            rememberMeData = new RememberMeData(user.clientUuid(), lgnToken, lgnValidator);
        }

        // 6. Resolve dynamic role (seller or buyer) and seller site IDs from database
        boolean isSeller = authRepository.isSeller(user.clientUuid());
        String role = isSeller ? "seller" : "buyer";
        List<Integer> siteIds = isSeller ? authRepository.findSellerSiteIds(user.clientUuid()) : null;

        String effectiveUsername = (user.email() != null && !user.email().isBlank()) ? user.email() : request.email();
        UserDetails userDetails = new User(
                effectiveUsername,
                user.pass() != null ? user.pass() : "",
                List.of(new SimpleGrantedAuthority(role))
        );

        Map<String, Object> claims = new java.util.HashMap<>();
        if (user.clientUuid() != null) claims.put("clientUuid", user.clientUuid());
        if (user.id() != null) claims.put("clientId", user.id());
        claims.put("role", role);
        if (siteIds != null && !siteIds.isEmpty()) {
            claims.put("siteIds", siteIds);
        }
        claims.put("profile", user.clientProfilId() != null ? user.clientProfilId() : "logged_in_user");
        String jwt = jwtService.generateToken(claims, userDetails);

        // 7. Construct Success AuthResponse with both JWT, role, siteIds and legacy JSP fields
        AuthResponse authResponse = AuthResponse.success(
                jwt,
                user.clientUuid(),
                user.email(),
                role,
                siteIds,
                request.isRememberMe(),
                lgnToken,
                lgnValidator
        );

        return new LoginResult(authResponse, rememberMeData);
    }

    private boolean verifyPassword(String rawPassword, String storedHash, String clientUuid) {
        if (storedHash == null || storedHash.isBlank() || rawPassword == null) {
            return false;
        }

        // 1. BCrypt verification
        if (storedHash.startsWith("$2a$") || storedHash.startsWith("$2b$") || storedHash.startsWith("$2y$")) {
            return passwordEncoder.matches(rawPassword, storedHash);
        }

        // 2. SHA-256 verification (64 characters)
        if (storedHash.length() == 64) {
            try {
                // A. Primary legacy portal formula: sha2(concat(salt, '#', password, '#', client_uuid), 256)
                if (clientUuid != null && !clientUuid.isBlank()) {
                    String salt = (clientPassSalt != null && !clientPassSalt.isBlank()) ? clientPassSalt : "38fc4120";
                    String saltedCombined = salt + "#" + rawPassword + "#" + clientUuid;
                    if (sha256Hex(saltedCombined).equalsIgnoreCase(storedHash)) {
                        return true;
                    }
                }

                // B. Plain SHA-256 (e.g. test accounts)
                if (sha256Hex(rawPassword).equalsIgnoreCase(storedHash)) {
                    return true;
                }

                // C. Alternate salt combinations (salt + pass, pass + salt)
                if (clientPassSalt != null && !clientPassSalt.isBlank()) {
                    if (sha256Hex(rawPassword + clientPassSalt).equalsIgnoreCase(storedHash) ||
                        sha256Hex(clientPassSalt + rawPassword).equalsIgnoreCase(storedHash)) {
                        return true;
                    }
                }
            } catch (Exception e) {
                log.error("Error verifying SHA-256 password hash", e);
            }
        }

        // 3. Legacy MD5 verification (32 characters, matching JSP pass = md5(?))
        if (storedHash.length() == 32) {
            try {
                MessageDigest md = MessageDigest.getInstance("MD5");
                byte[] digest = md.digest(rawPassword.getBytes(StandardCharsets.UTF_8));
                String md5Hex = HexFormat.of().formatHex(digest);
                return md5Hex.equalsIgnoreCase(storedHash);
            } catch (NoSuchAlgorithmException e) {
                throw new RuntimeException("MD5 algorithm unavailable", e);
            }
        }

        return false;
    }

    private String sha256Hex(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm unavailable", e);
        }
    }
}
