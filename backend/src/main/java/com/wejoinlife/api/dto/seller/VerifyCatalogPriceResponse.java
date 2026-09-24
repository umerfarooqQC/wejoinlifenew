package com.wejoinlife.api.dto.seller;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;

public record VerifyCatalogPriceResponse(
        @JsonProperty("listing") Map<String, Object> listing,
        @JsonProperty("previous_price") Double previousPrice,
        @JsonProperty("verified") boolean verified,
        @JsonProperty("idempotent_replay") boolean idempotentReplay
) {}
