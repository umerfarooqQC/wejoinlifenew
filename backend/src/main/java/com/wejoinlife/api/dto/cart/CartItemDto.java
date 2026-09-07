package com.wejoinlife.api.dto.cart;

import java.math.BigDecimal;

public record CartItemDto(
    String productId,
    String name,
    BigDecimal price,
    int quantity,
    String imageUrl,
    String shopId,
    String shopName
) {}
