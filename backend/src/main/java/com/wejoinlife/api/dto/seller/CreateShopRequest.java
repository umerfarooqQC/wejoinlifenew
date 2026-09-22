package com.wejoinlife.api.dto.seller;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record CreateShopRequest(
        @JsonProperty("display_name") String displayName,
        @JsonProperty("raison_d_etre") String raisonDetre,
        @JsonProperty("business_type") String businessType,
        @JsonProperty("category_ids") List<String> categoryIds,
        @JsonProperty("location") ShopLocation location,
        @JsonProperty("sales_model") String salesModel,
        @JsonProperty("contact_person") String contactPerson,
        @JsonProperty("contact_mobile") String contactMobile,
        @JsonProperty("email") String email,
        @JsonProperty("siret") String siret,
        @JsonProperty("allow_duplicate_name") Boolean allowDuplicateName,
        @JsonProperty("idempotency_key") String idempotencyKey
) {
    public record ShopLocation(
            @JsonProperty("address") String address,
            @JsonProperty("postal_code") String postalCode,
            @JsonProperty("city") String city,
            @JsonProperty("state") String state,
            @JsonProperty("country") String country,
            @JsonProperty("latitude") String latitude,
            @JsonProperty("longitude") String longitude
    ) {}
}

