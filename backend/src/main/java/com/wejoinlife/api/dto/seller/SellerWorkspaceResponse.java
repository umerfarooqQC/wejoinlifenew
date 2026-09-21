package com.wejoinlife.api.dto.seller;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record SellerWorkspaceResponse(
        @JsonProperty("seller") SellerSummary seller,
        @JsonProperty("shops") List<ShopItem> shops,
        @JsonProperty("selected_shop_id") String selectedShopId,
        @JsonProperty("storefront") StorefrontInfo storefront,
        @JsonProperty("locations") List<LocationInfo> locations,
        @JsonProperty("category_options") List<CategoryOption> categoryOptions,
        @JsonProperty("capabilities") CapabilitiesInfo capabilities,
        @JsonProperty("listing_counts") ListingCountsInfo listingCounts,
        @JsonProperty("meta") MetaInfo meta
) {

    public record SellerSummary(
            @JsonProperty("seller_id") String sellerId,
            @JsonProperty("name") String name,
            @JsonProperty("role") String role
    ) {}

    public record ShopItem(
            @JsonProperty("shop_id") String shopId,
            @JsonProperty("display_name") String displayName,
            @JsonProperty("status") String status,
            @JsonProperty("role") String role,
            @JsonProperty("selected") boolean selected
    ) {}

    public record StorefrontInfo(
            @JsonProperty("display_name") String displayName,
            @JsonProperty("business_type") String businessType,
            @JsonProperty("category_ids") List<String> categoryIds,
            @JsonProperty("status") String status
    ) {}

    public record LocationInfo(
            @JsonProperty("location_id") String locationId,
            @JsonProperty("name") String name,
            @JsonProperty("status") String status
    ) {}

    public record CategoryOption(
            @JsonProperty("category_id") String categoryId,
            @JsonProperty("name") String name,
            @JsonProperty("vertical") String vertical
    ) {}

    public record CapabilitiesInfo(
            @JsonProperty("shop_create") boolean shopCreate,
            @JsonProperty("listing_write") boolean listingWrite,
            @JsonProperty("menus") boolean menus
    ) {}

    public record ListingCountsInfo(
            @JsonProperty("active") int active
    ) {}

    public record MetaInfo(
            @JsonProperty("provider") String provider
    ) {}
}

