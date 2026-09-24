package com.wejoinlife.api.service;

import com.wejoinlife.api.dto.seller.VerifyCatalogPriceRequest;
import com.wejoinlife.api.dto.seller.VerifyCatalogPriceResponse;
import com.wejoinlife.api.exception.ApiException;
import com.wejoinlife.api.repository.SellerCatalogPriceRepository;
import com.wejoinlife.api.security.JwtService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SellerCatalogPriceService {

    private final SellerCatalogPriceRepository sellerCatalogPriceRepository;
    private final IdempotencyService idempotencyService;
    private final JwtService jwtService;

    @Transactional
    public VerifyCatalogPriceResponse verifyAndUpdatePrice(String authHeader, VerifyCatalogPriceRequest request) {
        String key = request.idempotencyKey() == null ? null : request.idempotencyKey().trim();
        String payloadHash = idempotencyService.computePayloadHash(request);

        if (key != null && !key.isBlank()) {
            Optional<VerifyCatalogPriceResponse> prev = idempotencyService.getExistingResponse(key, payloadHash, VerifyCatalogPriceResponse.class);
            if (prev.isPresent()) {
                return prev.get();
            }
        }

        validateSellerAccess(authHeader);

        BigDecimal expectedPrice = BigDecimal.valueOf(request.expectedPrice());
        BigDecimal newPrice = BigDecimal.valueOf(request.price());

        var listingOpt = sellerCatalogPriceRepository.findListingById(request.listingId());
        if (listingOpt.isEmpty()) {
            throw new ApiException(HttpStatus.NOT_FOUND, "LISTING_NOT_FOUND", "Listing not found.");
        }

        var variantOpt = sellerCatalogPriceRepository.findVariantById(request.variantId(), request.listingId());
        if (variantOpt.isEmpty()) {
            throw new ApiException(HttpStatus.NOT_FOUND, "VARIANT_NOT_FOUND", "Variant not found for this listing.");
        }

        Object priceObj = variantOpt.get().get("price");
        BigDecimal currentPrice = toBigDecimal(priceObj);
        if (currentPrice == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "PRICE_INVALID", "Variant price is invalid.");
        }

        if (currentPrice.compareTo(expectedPrice) != 0) {
            throw new ApiException(HttpStatus.CONFLICT, "PRICE_MISMATCH", "Price changed before update. Expected " + expectedPrice + " but current is " + currentPrice + ".");
        }

        int updated = sellerCatalogPriceRepository.updatePriceIfMatches(
                request.variantId(), request.listingId(), expectedPrice, newPrice, request.currencyCode()
        );

        if (updated != 1) {
            throw new ApiException(HttpStatus.CONFLICT, "PRICE_UPDATE_FAILED", "Unable to verify and update price due to concurrent modification.");
        }

        var updatedVariant = sellerCatalogPriceRepository.fetchUpdatedVariant(request.variantId(), request.listingId());

        Map<String, Object> listingMap = new LinkedHashMap<>();
        var listing = listingOpt.get();
        listingMap.put("id", listing.get("id"));
        listingMap.put("name", listing.get("name"));
        listingMap.put("catalog_id", listing.get("catalog_id"));
        listingMap.put("variant_id", request.variantId());
        listingMap.put("currency_code", request.currencyCode());

        VerifyCatalogPriceResponse response = new VerifyCatalogPriceResponse(
                listingMap,
                currentPrice.doubleValue(),
                true,
                false
        );

        if (key != null && !key.isBlank()) {
            idempotencyService.storeResponse(key, payloadHash, response);
        }

        return response;
    }

    private void validateSellerAccess(String authHeader) {
        if (authHeader == null || authHeader.isBlank()) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Authorization token is required.");
        }

        String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7).trim() : authHeader.trim();
        if (token.isBlank()) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Invalid authorization token.");
        }

        Claims claims;
        try {
            claims = jwtService.extractAllClaims(token);
        } catch (Exception e) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Invalid or expired authorization token.");
        }

        if (jwtService.isTokenExpired(claims)) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Invalid or expired authorization token.");
        }

        String role = (String) claims.get("role");
        if (role == null || !"seller".equalsIgnoreCase(role.trim())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "Access denied. Only sellers can update catalog prices.");
        }
    }

    private BigDecimal toBigDecimal(Object obj) {
        if (obj == null) return null;
        if (obj instanceof BigDecimal bd) return bd;
        if (obj instanceof Number n) return BigDecimal.valueOf(n.doubleValue());
        try {
            return new BigDecimal(obj.toString());
        } catch (Exception e) {
            return null;
        }
    }
}
