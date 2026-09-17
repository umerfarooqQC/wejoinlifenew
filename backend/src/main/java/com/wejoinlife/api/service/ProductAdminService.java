package com.wejoinlife.api.service;

import com.wejoinlife.api.dto.product.AddProductRequest;
import com.wejoinlife.api.dto.product.ProductActionResponse;
import com.wejoinlife.api.model.CatalogRecord;
import com.wejoinlife.api.model.SiteRecord;
import com.wejoinlife.api.repository.AuthRepository;
import com.wejoinlife.api.repository.ProductAdminRepository;
import com.wejoinlife.api.security.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductAdminService {

    private final ProductAdminRepository productAdminRepository;
    private final AuthRepository authRepository;
    private final JwtService jwtService;

    @Transactional
    public ProductActionResponse addProduct(String siteUid, AddProductRequest request) {
        return addProduct(null, siteUid, request);
    }

    @Transactional
    public ProductActionResponse addProduct(String authHeader, String siteIdentifier, AddProductRequest request) {
        SiteRecord site = null;
        int createdBy = 1;

        // 1. Resolve authentication & site context via JWT token or legacy site identifier
        String jwtToken = null;
        if (authHeader != null && !authHeader.isBlank()) {
            if (authHeader.startsWith("Bearer ")) {
                jwtToken = authHeader.substring(7).trim();
            } else {
                jwtToken = authHeader.trim();
            }
        }

        if (jwtToken != null && !jwtToken.isBlank()) {
            Claims claims;
            try {
                claims = jwtService.extractAllClaims(jwtToken);
            } catch (ExpiredJwtException e) {
                return ProductActionResponse.error(1, "Authorization token has expired.");
            } catch (JwtException e) {
                return ProductActionResponse.error(1, "Invalid authorization token.");
            } catch (Exception e) {
                return ProductActionResponse.error(1, "Invalid or expired authorization token.");
            }

            if (claims == null || jwtService.isTokenExpired(claims)) {
                return ProductActionResponse.error(1, "Invalid or expired authorization token.");
            }

            // Role check: Only sellers can add products
            String role = (String) claims.get("role");
            if (role == null || !"seller".equalsIgnoreCase(role.trim())) {
                return ProductActionResponse.error(1, "Access denied. Only sellers can add products.");
            }

            // Client ID extraction for created_by
            Object clientIdObj = claims.get("clientId");
            if (clientIdObj != null) {
                try {
                    createdBy = Integer.parseInt(clientIdObj.toString());
                } catch (NumberFormatException ignored) {}
            }

            // Extract seller site IDs from JWT
            String clientUuid = (String) claims.get("clientUuid");
            List<Integer> sellerSiteIds = jwtService.extractSiteIds(claims);
            if ((sellerSiteIds == null || sellerSiteIds.isEmpty()) && clientUuid != null) {
                sellerSiteIds = authRepository.findSellerSiteIds(clientUuid);
            }

            if (sellerSiteIds == null || sellerSiteIds.isEmpty()) {
                return ProductActionResponse.error(1, "No sites associated with this seller account.");
            }

            // If a specific site is requested, verify the seller has access to it
            if (siteIdentifier != null && !siteIdentifier.isBlank()) {
                Optional<SiteRecord> siteOpt = productAdminRepository.findSiteByIdOrSuid(siteIdentifier.trim());
                if (siteOpt.isEmpty()) {
                    return ProductActionResponse.error(2, "Invalid Site id provided.");
                }
                SiteRecord specifiedSite = siteOpt.get();
                int specifiedSiteId;
                try {
                    specifiedSiteId = Integer.parseInt(specifiedSite.id());
                } catch (Exception e) {
                    specifiedSiteId = -1;
                }
                if (!sellerSiteIds.contains(specifiedSiteId)) {
                    return ProductActionResponse.error(2, "Seller does not have access to the specified site.");
                }
                site = specifiedSite;
            } else {
                // Automatically use seller's primary site from JWT
                int defaultSiteId = sellerSiteIds.get(0);
                Optional<SiteRecord> siteOpt = productAdminRepository.findSiteById(defaultSiteId);
                if (siteOpt.isEmpty()) {
                    return ProductActionResponse.error(2, "Associated site not found.");
                }
                site = siteOpt.get();
            }

        } else if (siteIdentifier != null && !siteIdentifier.isBlank()) {
            // Fallback for calls passing site identifier without JWT
            Optional<SiteRecord> siteOpt = productAdminRepository.findSiteByIdOrSuid(siteIdentifier.trim());
            if (siteOpt.isEmpty()) {
                return ProductActionResponse.error(2, "Invalid Site id provided.");
            }
            site = siteOpt.get();
            if (site.createdBy() != null) {
                createdBy = site.createdBy();
            }
        } else {
            return ProductActionResponse.error(1, "Authorization token is required in header.");
        }

        if (site == null) {
            return ProductActionResponse.error(2, "Invalid Site id provided.");
        }

        if (createdBy == 1 && site.createdBy() != null) {
            createdBy = site.createdBy();
        }

        // 2. Validate catalog_id
        String catalogId = request.getEffectiveCatalogId();
        if (catalogId.isEmpty()) {
            return ProductActionResponse.error(4, "Catalog id is not provided");
        }

        Optional<CatalogRecord> catalogOpt = productAdminRepository.findCatalogById(catalogId);
        if (catalogOpt.isEmpty()) {
            return ProductActionResponse.error(4, "Catalog not found");
        }

        CatalogRecord catalog = catalogOpt.get();

        // 3. Validate product name
        String name = request.getEffectiveName();
        if (name.isEmpty()) {
            return ProductActionResponse.error(5, "Product name is not provided");
        }

        // 4. Resolve language
        String langCode = (request.lang() != null && !request.lang().isBlank())
                ? request.lang()
                : (site.defaultLang() != null ? site.defaultLang() : "fr");
        int langueId = productAdminRepository.findLanguageIdByCode(langCode);

        // 5. Parse price and stock safely
        BigDecimal price;
        try {
            String priceNormalized = request.getEffectivePrice().replace(",", ".");
            price = new BigDecimal(priceNormalized);
        } catch (Exception e) {
            price = BigDecimal.ZERO;
        }

        int stock;
        try {
            stock = Integer.parseInt(request.getEffectiveStock().trim());
        } catch (Exception e) {
            stock = 1000000;
        }

        // 6. Generate SKU & UUIDs
        String suggestedName = name.replaceAll("\\s+", "_").toLowerCase();
        String sku = request.getEffectiveSku(suggestedName);

        String productId = UUID.randomUUID().toString();
        String variantUuid = UUID.randomUUID().toString();
        String productUuid = UUID.randomUUID().toString();

        String ptitle = name + " | " + (catalog.name() != null ? catalog.name() : "");
        String pagePath = name.toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "");
        if (pagePath.isEmpty()) {
            pagePath = "product-" + System.currentTimeMillis();
        }

        int showQuickbuy = "1".equals(request.getEffectiveShowQuickbuy()) ? 1 : 0;

        try {
            // 7. Insert into products
            productAdminRepository.insertProduct(
                    productId,
                    catalogId,
                    productUuid,
                    "product",
                    showQuickbuy,
                    langueId,
                    name,
                    request.getEffectiveSummary(),
                    request.getEffectiveFeatures(),
                    price.toPlainString(),
                    stock,
                    createdBy
            );

            // 8. Insert into product_variants
            int variantId = productAdminRepository.insertProductVariant(
                    productId,
                    variantUuid,
                    sku,
                    price,
                    stock,
                    createdBy
            );

            // 9. Insert into product_variant_details
            productAdminRepository.insertProductVariantDetails(
                    variantId,
                    langueId,
                    name,
                    request.getEffectiveFeatures()
            );

            // 10. Insert into product_descriptions
            productAdminRepository.insertProductDescriptions(
                    productId,
                    langueId,
                    request.getEffectiveSummary(),
                    request.getEffectiveFeatures(),
                    pagePath,
                    ptitle
            );

            // 11. Copy catalog attributes to product_variant_ref
            productAdminRepository.insertCatalogAttributeRefs(variantId, catalogId);

            // 12. Insert tags
            productAdminRepository.insertProductTags(productId, request.productTags(), createdBy);

            // 13. Fetch variant details
            Map<String, Object> variant = productAdminRepository.getVariantDetails(
                    site.id(),
                    productId,
                    variantId,
                    langueId
            );

            return ProductActionResponse.success(productId, String.valueOf(variantId), variant);

        } catch (Exception e) {
            log.error("Error inserting product into catalog", e);
            return ProductActionResponse.error(6, "Error inserting product: " + e.getMessage());
        }
    }
}

