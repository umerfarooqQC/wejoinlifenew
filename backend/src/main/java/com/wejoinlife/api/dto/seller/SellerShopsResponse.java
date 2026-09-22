package com.wejoinlife.api.dto.seller;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record SellerShopsResponse(
        @JsonProperty("items") List<ShopItem> items,
        @JsonProperty("count") int count,
        @JsonProperty("meta") MetaInfo meta
) {
    public record ShopItem(
            @JsonProperty("shop_id") String shopId,
            @JsonProperty("display_name") String displayName,
            @JsonProperty("status") String status,
            @JsonProperty("role") String role,
            @JsonProperty("selected") boolean selected
    ) {}

    public record MetaInfo(
            @JsonProperty("provider") String provider
    ) {}
}

