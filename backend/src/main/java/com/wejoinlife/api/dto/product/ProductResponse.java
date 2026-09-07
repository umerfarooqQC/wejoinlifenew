package com.wejoinlife.api.dto.product;

import java.math.BigDecimal;

public record ProductResponse(
    String id,
    String shopId,
    String shopName,
    String name,
    String slug,
    BigDecimal price,
    int stockQuantity,
    String imageUrl,
    String status
) {}
