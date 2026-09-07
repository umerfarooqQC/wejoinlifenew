package com.wejoinlife.api.dto.product;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record ProductCreateRequest(
    @NotBlank(message = "Product name is required")
    String name,

    @NotBlank(message = "Shop ID is required")
    String shopId,

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be greater than zero")
    BigDecimal price,

    int stockQuantity,
    String imageUrl,
    String description
) {}
