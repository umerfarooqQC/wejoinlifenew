package com.wejoinlife.api.dto.seller;

import com.fasterxml.jackson.annotation.JsonProperty;

public record SelectShopResponse(
        @JsonProperty("selected_shop_id")
        String selectedShopId
) {}

