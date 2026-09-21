package com.wejoinlife.api.service;

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

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SellerWorkspaceService {

    private final JwtService jwtService;
    private final AuthRepository authRepository;
    private final SellerWorkspaceRepository sellerWorkspaceRepository;

    public SellerWorkspaceResponse getWorkspace(
            String authHeader,
            String mcpUserId,
            String mcpSellerId,
            String requestedShopId) {

        List<Integer> allowedSiteIds = new ArrayList<>();
        String clientUuid = null;

        // 1. Authenticate seller
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

        // 2. Resolve selected shop and enforce multi-tenancy scoping
        String effectiveShopParam = (requestedShopId != null && !requestedShopId.isBlank())
                ? requestedShopId.trim()
                : (mcpSellerId != null && !mcpSellerId.isBlank() ? mcpSellerId.trim() : null);

        int selectedSiteId;
        if (effectiveShopParam != null) {
            try {
                selectedSiteId = Integer.parseInt(effectiveShopParam);
            } catch (NumberFormatException e) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "BAD_REQUEST", "Invalid shop id format: " + effectiveShopParam);
            }

            if (!allowedSiteIds.contains(selectedSiteId)) {
                throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "Cross-shop access forbidden.");
            }
        } else {
            selectedSiteId = allowedSiteIds.get(0);
        }

        // 3. Retrieve shops and mark selected
        List<ShopRecord> shopRecords = sellerWorkspaceRepository.findShopsBySiteIds(allowedSiteIds);
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
}
