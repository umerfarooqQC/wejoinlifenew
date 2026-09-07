package com.wejoinlife.api.model;

import com.wejoinlife.api.model.enums.OrderStatus;
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
public class SubOrder {
    private String id;
    private String parentOrderId;
    private String shopId;
    private BigDecimal subtotal;
    private BigDecimal shippingFee;
    private BigDecimal platformFee;
    private BigDecimal sellerPayout;
    private OrderStatus status;
    private LocalDateTime createdAt;
}
