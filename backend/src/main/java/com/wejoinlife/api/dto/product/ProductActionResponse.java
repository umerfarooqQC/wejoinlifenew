package com.wejoinlife.api.dto.product;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ProductActionResponse(
    int status,
    String msg,
    String productid,
    String variantid,
    Map<String, Object> data
) {
    public static ProductActionResponse success(String productId, String variantId, Map<String, Object> variant) {
        Map<String, Object> data = new java.util.HashMap<>();
        data.put("productid", productId);
        data.put("variantid", variantId);
        if (variant != null) {
            data.put("variant", variant);
        }
        return new ProductActionResponse(0, "Success", productId, variantId, data);
    }

    public static ProductActionResponse error(int status, String msg) {
        return new ProductActionResponse(status, msg, null, null, Map.of());
    }
}

