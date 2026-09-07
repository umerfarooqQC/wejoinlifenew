package com.wejoinlife.api.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Shop {
    private String id;
    private String ownerId;
    private String shopName;
    private String slug;
    private String logoUrl;
    private String bannerUrl;
    private BigDecimal rating;
    private BigDecimal commissionRate;
    private String status;
    private LocalDateTime createdAt;
}
