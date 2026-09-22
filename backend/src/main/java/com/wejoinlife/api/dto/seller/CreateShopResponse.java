package com.wejoinlife.api.dto.seller;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record CreateShopResponse(
        @JsonProperty("created") boolean created,
        @JsonProperty("selected_shop_id") String selectedShopId,
        @JsonProperty("shop_id") String shopId,
        @JsonProperty("provisioning") boolean provisioning,
        @JsonProperty("display_name") String displayName,
        @JsonProperty("status") String status,
        @JsonProperty("rlink") String rlink,
        @JsonProperty("terms_and_conditions_accepted") boolean termsAndConditionsAccepted,
        @JsonProperty("meta") MetaInfo meta
) {
    public record MetaInfo(
            @JsonProperty("provider") String provider
    ) {}
}

