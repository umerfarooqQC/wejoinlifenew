package com.wejoinlife.api.dto.seller;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record VerifyCatalogPriceRequest(
        @NotBlank
        @JsonAlias({"catalog_id", "catalogId"})
        @JsonProperty("catalog_id")
        String catalogId,

        @NotBlank
        @JsonAlias({"listing_id", "listingId"})
        @JsonProperty("listing_id")
        String listingId,

        @NotBlank
        @JsonAlias({"variant_id", "variantId"})
        @JsonProperty("variant_id")
        String variantId,

        @NotNull
        @DecimalMin(value = "0.0", inclusive = true)
        @JsonAlias({"expected_price", "expectedPrice"})
        @JsonProperty("expected_price")
        Double expectedPrice,

        @NotNull
        @DecimalMin(value = "0.0", inclusive = true)
        @JsonAlias({"price"})
        @JsonProperty("price")
        Double price,

        @NotBlank
        @JsonAlias({"currency_code", "currencyCode"})
        @JsonProperty("currency_code")
        String currencyCode,

        @NotBlank
        @JsonAlias({"idempotency_key", "idempotencyKey"})
        @JsonProperty("idempotency_key")
        String idempotencyKey
) {}
