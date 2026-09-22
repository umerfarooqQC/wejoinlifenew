package com.wejoinlife.api.service;

import com.wejoinlife.api.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class IdempotencyService {

    private record IdempotentEntry(
            String payloadHash,
            Object response
    ) {}

    private final Map<String, IdempotentEntry> cache = new ConcurrentHashMap<>();

    public String computePayloadHash(Object payload) {
        if (payload == null) {
            return "";
        }
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(payload.toString().getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }

    public <T> Optional<T> getExistingResponse(String key, String currentPayloadHash, Class<T> responseClass) {
        if (key == null || key.isBlank()) {
            return Optional.empty();
        }
        IdempotentEntry entry = cache.get(key.trim());
        if (entry == null) {
            return Optional.empty();
        }
        if (!entry.payloadHash().equals(currentPayloadHash)) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "IDEMPOTENCY_KEY_REUSED",
                    "Idempotency key reused with a different payload."
            );
        }
        return Optional.ofNullable(responseClass.cast(entry.response()));
    }

    public void storeResponse(String key, String payloadHash, Object response) {
        if (key != null && !key.isBlank()) {
            cache.put(key.trim(), new IdempotentEntry(payloadHash, response));
        }
    }
}

