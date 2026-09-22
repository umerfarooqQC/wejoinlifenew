package com.wejoinlife.api.service;

import com.wejoinlife.api.dto.seller.CreateShopRequest;
import com.wejoinlife.api.dto.seller.CreateShopResponse;
import com.wejoinlife.api.dto.seller.SelectShopResponse;
import com.wejoinlife.api.dto.seller.SellerShopsResponse;
import com.wejoinlife.api.dto.seller.SellerWorkspaceResponse;
import com.wejoinlife.api.exception.ApiException;
import com.wejoinlife.api.repository.AuthRepository;
import com.wejoinlife.api.repository.SellerWorkspaceRepository;
import com.wejoinlife.api.repository.SellerWorkspaceRepository.ShopRecord;
import com.wejoinlife.api.security.JwtService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class SellerWorkspaceService {

    private final JwtService jwtService;
    private final AuthRepository authRepository;
    private final SellerWorkspaceRepository sellerWorkspaceRepository;
    private final IdempotencyService idempotencyService;

    private final Map<String, Integer> activeShopSessions = new ConcurrentHashMap<>();

    private record SellerContext(
            String clientUuid,
            List<Integer> allowedSiteIds
    ) {}

    private SellerContext authenticateSeller(String authHeader, String mcpUserId) {
        List<Integer> allowedSiteIds = new ArrayList<>();
        String clientUuid = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7).trim();
            if (token.isEmpty()) {
                throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Invalid or expired authorization token.");
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

            clientUuid = (String) claims.get("clientUuid");
            String role = (String) claims.get("role");

            if (role != null && !"seller".equalsIgnoreCase(role) && !authRepository.isSeller(clientUuid)) {
                throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "Access denied. Only sellers can access this workspace.");
            }

            List<Integer> tokenSites = jwtService.extractSiteIds(claims);
            if (tokenSites != null && !tokenSites.isEmpty()) {
                allowedSiteIds.addAll(tokenSites);
            } else if (clientUuid != null) {
                allowedSiteIds.addAll(authRepository.findSellerSiteIds(clientUuid));
            }

        } else if (mcpUserId != null && !mcpUserId.isBlank()) {
            clientUuid = mcpUserId.trim();
            if (!authRepository.isSeller(clientUuid)) {
                throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "Access denied. Only sellers can access this workspace.");
            }
            allowedSiteIds.addAll(authRepository.findSellerSiteIds(clientUuid));
        } else {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Authorization token is required in header.");
        }

        if (allowedSiteIds.isEmpty()) {
            throw new ApiException(HttpStatus.NOT_FOUND, "NOT_FOUND", "No shops associated with this seller account.");
        }

        return new SellerContext(clientUuid, allowedSiteIds);
    }

    private int resolveSelectedSiteId(String clientUuid, List<Integer> allowedSiteIds, String effectiveShopParam) {
        if (effectiveShopParam != null && !effectiveShopParam.isBlank()) {
            int selectedSiteId;
            try {
                selectedSiteId = Integer.parseInt(effectiveShopParam.trim());
            } catch (NumberFormatException e) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "BAD_REQUEST", "Invalid shop id format: " + effectiveShopParam);
            }

            if (!allowedSiteIds.contains(selectedSiteId)) {
                throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "Cross-shop access forbidden.");
            }
            return selectedSiteId;
        } else {
            if (clientUuid != null && activeShopSessions.containsKey(clientUuid)) {
                Integer sessionSiteId = activeShopSessions.get(clientUuid);
                if (sessionSiteId != null && allowedSiteIds.contains(sessionSiteId)) {
                    return sessionSiteId;
                }
            }
            return allowedSiteIds.get(0);
        }
    }

    public SellerShopsResponse getShops(
            String authHeader,
            String mcpUserId,
            String mcpSellerId,
            String requestedShopId) {

        SellerContext ctx = authenticateSeller(authHeader, mcpUserId);

        String effectiveShopParam = (requestedShopId != null && !requestedShopId.isBlank())
                ? requestedShopId.trim()
                : (mcpSellerId != null && !mcpSellerId.isBlank() ? mcpSellerId.trim() : null);

        int selectedSiteId = resolveSelectedSiteId(ctx.clientUuid(), ctx.allowedSiteIds(), effectiveShopParam);

        List<ShopRecord> shopRecords = sellerWorkspaceRepository.findShopsBySiteIds(ctx.allowedSiteIds());

        List<SellerShopsResponse.ShopItem> items = new ArrayList<>();
        for (ShopRecord record : shopRecords) {
            boolean isSelected = (record.siteId() == selectedSiteId);
            items.add(new SellerShopsResponse.ShopItem(
                    String.valueOf(record.siteId()),
                    record.resolveDisplayName(),
                    record.resolveStatus(),
                    "seller",
                    isSelected
            ));
        }

        return new SellerShopsResponse(
                items,
                items.size(),
                new SellerShopsResponse.MetaInfo("legacy")
        );
    }

    public SellerWorkspaceResponse getWorkspace(
            String authHeader,
            String mcpUserId,
            String mcpSellerId,
            String requestedShopId) {

        SellerContext ctx = authenticateSeller(authHeader, mcpUserId);

        String effectiveShopParam = (requestedShopId != null && !requestedShopId.isBlank())
                ? requestedShopId.trim()
                : (mcpSellerId != null && !mcpSellerId.isBlank() ? mcpSellerId.trim() : null);

        int selectedSiteId = resolveSelectedSiteId(ctx.clientUuid(), ctx.allowedSiteIds(), effectiveShopParam);

        // 3. Retrieve shops and mark selected
        List<ShopRecord> shopRecords = sellerWorkspaceRepository.findShopsBySiteIds(ctx.allowedSiteIds());
        ShopRecord selectedShop = null;

        List<SellerWorkspaceResponse.ShopItem> shops = new ArrayList<>();
        for (ShopRecord record : shopRecords) {
            boolean isSelected = (record.siteId() == selectedSiteId);
            if (isSelected) {
                selectedShop = record;
            }
            shops.add(new SellerWorkspaceResponse.ShopItem(
                    String.valueOf(record.siteId()),
                    record.resolveDisplayName(),
                    record.resolveStatus(),
                    "seller",
                    isSelected
            ));
        }

        if (selectedShop == null) {
            var shopOpt = sellerWorkspaceRepository.findShopBySiteId(selectedSiteId);
            if (shopOpt.isEmpty()) {
                throw new ApiException(HttpStatus.NOT_FOUND, "NOT_FOUND", "Shop not found.");
            }
            selectedShop = shopOpt.get();
        }

        String selectedShopIdStr = String.valueOf(selectedSiteId);

        // 4. Construct aggregate workspace sections
        SellerWorkspaceResponse.SellerSummary seller = new SellerWorkspaceResponse.SellerSummary(
                selectedShopIdStr,
                selectedShop.resolveDisplayName(),
                "seller"
        );

        List<String> categoryIds = sellerWorkspaceRepository.findCategoryIds(selectedShop.sellerUuid());
        SellerWorkspaceResponse.StorefrontInfo storefront = new SellerWorkspaceResponse.StorefrontInfo(
                selectedShop.resolveDisplayName(),
                selectedShop.resolveBusinessType(),
                categoryIds,
                selectedShop.resolveStatus()
        );

        List<SellerWorkspaceResponse.LocationInfo> locations = sellerWorkspaceRepository.findLocations(
                selectedShop.sellerUuid(),
                selectedSiteId,
                selectedShop.resolveDisplayName(),
                selectedShop.resolveIsOpen()
        );

        List<SellerWorkspaceResponse.CategoryOption> categoryOptions =
                sellerWorkspaceRepository.findCategoryOptions(selectedShop.sellerUuid());

        SellerWorkspaceResponse.CapabilitiesInfo capabilities =
                new SellerWorkspaceResponse.CapabilitiesInfo(true, true, true);

        int activeListings = sellerWorkspaceRepository.countActiveListings(selectedSiteId);
        SellerWorkspaceResponse.ListingCountsInfo listingCounts =
                new SellerWorkspaceResponse.ListingCountsInfo(activeListings);

        SellerWorkspaceResponse.MetaInfo meta = new SellerWorkspaceResponse.MetaInfo("legacy");

        return new SellerWorkspaceResponse(
                seller,
                shops,
                selectedShopIdStr,
                storefront,
                locations,
                categoryOptions,
                capabilities,
                listingCounts,
                meta
        );
    }

    private String resolveClientUuid(String authHeader, String mcpUserId) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7).trim();
            if (token.isEmpty()) {
                throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Invalid or expired authorization token.");
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
            String clientUuid = (String) claims.get("clientUuid");
            if (clientUuid == null || clientUuid.isBlank()) {
                clientUuid = claims.getSubject();
            }
            if (clientUuid != null && !clientUuid.isBlank()) {
                return clientUuid.trim();
            }
        } else if (mcpUserId != null && !mcpUserId.isBlank()) {
            return mcpUserId.trim();
        }
        throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Authorization token is required in header.");
    }

    @Transactional
    public CreateShopResponse createShop(
            String authHeader,
            String mcpUserId,
            String idempotencyKeyHeader,
            CreateShopRequest req
    ) {
        String clientUuid = resolveClientUuid(authHeader, mcpUserId);

        String effectiveIdempotencyKey = (idempotencyKeyHeader != null && !idempotencyKeyHeader.isBlank())
                ? idempotencyKeyHeader.trim()
                : (req != null && req.idempotencyKey() != null && !req.idempotencyKey().isBlank()
                ? req.idempotencyKey().trim()
                : null);

        String payloadHash = null;
        if (effectiveIdempotencyKey != null) {
            payloadHash = idempotencyService.computePayloadHash(req);
            Optional<CreateShopResponse> cached = idempotencyService.getExistingResponse(effectiveIdempotencyKey, payloadHash, CreateShopResponse.class);
            if (cached.isPresent()) {
                return cached.get();
            }
        }

        if (req == null) {
            throw new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, "WJL_REGISTRATION_REJECTED", "Request body is required.");
        }

        if (req.displayName() == null || req.displayName().trim().isBlank()) {
            throw new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, "WJL_REGISTRATION_REJECTED", "Business display name is required.");
        }

        if (req.email() == null || req.email().trim().isBlank()) {
            throw new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, "WJL_REGISTRATION_REJECTED", "Provide a valid email address.");
        }

        String email = req.email().trim();
        if (!email.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
            throw new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, "WJL_REGISTRATION_REJECTED", "Provide a valid email address.");
        }

        if (sellerWorkspaceRepository.isDisposableDomain(email)) {
            throw new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, "WJL_REGISTRATION_EMAIL_REJECTED", "Email domain is disposable or not allowed.");
        }

        if (req.contactPerson() == null || req.contactPerson().trim().isBlank()) {
            throw new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, "WJL_REGISTRATION_REJECTED", "Provide contact person's name.");
        }

        if (req.contactMobile() == null || req.contactMobile().trim().isBlank()) {
            throw new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, "WJL_REGISTRATION_REJECTED", "Provide a valid contact number.");
        }

        if (req.location() == null ||
                req.location().address() == null || req.location().address().trim().isBlank() ||
                req.location().city() == null || req.location().city().trim().isBlank()) {
            throw new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, "WJL_REGISTRATION_REJECTED", "Address and city are required.");
        }

        if (sellerWorkspaceRepository.isEmailTakenByOtherClient(email, clientUuid)) {
            throw new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, "WJL_REGISTRATION_REJECTED", "Email provided is already registered to another account.");
        }

        if (sellerWorkspaceRepository.isMobileTakenByOtherClient(req.contactMobile().trim(), clientUuid)) {
            throw new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, "WJL_REGISTRATION_REJECTED", "Contact number provided is already registered to another account.");
        }

        String country = (req.location().country() != null && !req.location().country().isBlank())
                ? req.location().country().trim()
                : "fr";

        boolean allowDuplicate = Boolean.TRUE.equals(req.allowDuplicateName());
        if (!allowDuplicate && sellerWorkspaceRepository.existsBusinessName(req.displayName().trim(), country)) {
            throw new ApiException(HttpStatus.CONFLICT, "WJL_BUSINESS_NAME_EXISTS", "This business name is already registered with us.");
        }

        String sellerUuid = UUID.randomUUID().toString();
        String siteUuid = UUID.randomUUID().toString();
        String locationId = UUID.randomUUID().toString();

        String displayName = req.displayName().trim();
        String address = req.location().address().trim();
        String city = req.location().city().trim();
        String postalCode = req.location().postalCode() != null ? req.location().postalCode().trim() : "";
        String state = req.location().state() != null ? req.location().state().trim() : "";
        String latitude = req.location().latitude() != null ? req.location().latitude().trim() : null;
        String longitude = req.location().longitude() != null ? req.location().longitude().trim() : null;

        String currencyCode = sellerWorkspaceRepository.findCurrencyCodeForCountry(country);

        sellerWorkspaceRepository.insertSeller(
                sellerUuid,
                clientUuid,
                displayName,
                displayName,
                req.businessType(),
                address,
                city,
                state,
                country,
                postalCode,
                req.contactPerson().trim(),
                req.contactMobile().trim(),
                email,
                req.siret(),
                currencyCode,
                req.salesModel(),
                req.raisonDetre(),
                "UTC",
                latitude,
                longitude
        );

        int siteId = sellerWorkspaceRepository.insertSite(siteUuid, displayName, sellerUuid, country);
        sellerWorkspaceRepository.updateSellerSiteId(sellerUuid, siteId);
        sellerWorkspaceRepository.insertClientSeller(clientUuid, sellerUuid);

        if (req.categoryIds() != null && !req.categoryIds().isEmpty()) {
            sellerWorkspaceRepository.insertSellerCategories(sellerUuid, req.categoryIds());
        }

        sellerWorkspaceRepository.insertSellerShopLocation(
                locationId,
                sellerUuid,
                displayName,
                address,
                city,
                state,
                country,
                postalCode,
                req.contactMobile().trim(),
                latitude,
                longitude
        );

        sellerWorkspaceRepository.insertSellerPayment(sellerUuid);
        sellerWorkspaceRepository.insertPostWork(sellerUuid);

        String shopIdStr = String.valueOf(siteId);
        CreateShopResponse response = new CreateShopResponse(
                true,
                shopIdStr,
                shopIdStr,
                true,
                displayName,
                "active",
                "/seller/completion.jsp",
                true,
                new CreateShopResponse.MetaInfo("legacy")
        );

        if (effectiveIdempotencyKey != null && payloadHash != null) {
            idempotencyService.storeResponse(effectiveIdempotencyKey, payloadHash, response);
        }

        if (clientUuid != null) {
            activeShopSessions.put(clientUuid, siteId);
        }

        return response;
    }

    @Transactional
    public SelectShopResponse selectShop(
            String authHeader,
            String mcpUserId,
            String idempotencyKeyHeader,
            String shopIdStr
    ) {
        SellerContext ctx = authenticateSeller(authHeader, mcpUserId);

        if (shopIdStr == null || shopIdStr.trim().isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "BAD_REQUEST", "Shop ID is required.");
        }

        int siteId;
        try {
            siteId = Integer.parseInt(shopIdStr.trim());
        } catch (NumberFormatException e) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "BAD_REQUEST", "Invalid shop id format: " + shopIdStr);
        }

        if (!ctx.allowedSiteIds().contains(siteId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "Cross-shop access forbidden.");
        }

        // Verify shop exists
        Optional<ShopRecord> shopOpt = sellerWorkspaceRepository.findShopBySiteId(siteId);
        if (shopOpt.isEmpty()) {
            throw new ApiException(HttpStatus.NOT_FOUND, "NOT_FOUND", "Shop not found.");
        }

        String effectiveIdempotencyKey = (idempotencyKeyHeader != null && !idempotencyKeyHeader.isBlank())
                ? idempotencyKeyHeader.trim()
                : null;

        String payloadHash = null;
        if (effectiveIdempotencyKey != null) {
            payloadHash = idempotencyService.computePayloadHash(shopIdStr.trim());
            Optional<SelectShopResponse> cached = idempotencyService.getExistingResponse(
                    effectiveIdempotencyKey,
                    payloadHash,
                    SelectShopResponse.class
            );
            if (cached.isPresent()) {
                return cached.get();
            }
        }

        // Update database records for seller terms and site selection
        sellerWorkspaceRepository.updateSellerTermsAndActiveSite(ctx.clientUuid(), siteId);

        // Update session's active shop
        if (ctx.clientUuid() != null) {
            activeShopSessions.put(ctx.clientUuid(), siteId);
        }

        SelectShopResponse response = new SelectShopResponse(String.valueOf(siteId));

        if (effectiveIdempotencyKey != null && payloadHash != null) {
            idempotencyService.storeResponse(effectiveIdempotencyKey, payloadHash, response);
        }

        return response;
    }
}
