package com.wejoinlife.api.controller.seller;

import com.wejoinlife.api.dto.seller.CreateShopRequest;
import com.wejoinlife.api.dto.seller.CreateShopResponse;
import com.wejoinlife.api.dto.seller.SelectShopResponse;
import com.wejoinlife.api.dto.seller.SellerShopsResponse;
import com.wejoinlife.api.dto.seller.SellerWorkspaceResponse;
import com.wejoinlife.api.service.SellerWorkspaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/wjlapi/v1/seller", "/wjlapi/api/v1/seller", "/v1/seller", "/api/v1/seller"})
@RequiredArgsConstructor
public class SellerWorkspaceController {

    private final SellerWorkspaceService sellerWorkspaceService;

    private String resolveRequestedShopId(
            String shopIdParam,
            String siteIdParam,
            String sId,
            String siteIdHeader,
            String mcpSellerId) {
        if (shopIdParam != null && !shopIdParam.isBlank()) {
            return shopIdParam.trim();
        } else if (siteIdParam != null && !siteIdParam.isBlank()) {
            return siteIdParam.trim();
        } else if (sId != null && !sId.isBlank()) {
            return sId.trim();
        } else if (siteIdHeader != null && !siteIdHeader.isBlank()) {
            return siteIdHeader.trim();
        } else if (mcpSellerId != null && !mcpSellerId.isBlank()) {
            return mcpSellerId.trim();
        }
        return null;
    }

    @GetMapping("/workspace")
    public ResponseEntity<SellerWorkspaceResponse> getWorkspace(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "X-NewMCP-User-ID", required = false) String mcpUserId,
            @RequestHeader(value = "X-NewMCP-Seller-ID", required = false) String mcpSellerId,
            @RequestHeader(value = "s-id", required = false) String sId,
            @RequestHeader(value = "site-id", required = false) String siteIdHeader,
            @RequestParam(value = "shop_id", required = false) String shopIdParam,
            @RequestParam(value = "site_id", required = false) String siteIdParam) {

        String requestedShopId = resolveRequestedShopId(shopIdParam, siteIdParam, sId, siteIdHeader, mcpSellerId);

        SellerWorkspaceResponse response = sellerWorkspaceService.getWorkspace(
                authHeader,
                mcpUserId,
                mcpSellerId,
                requestedShopId
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/shops")
    public ResponseEntity<SellerShopsResponse> getShops(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "X-NewMCP-User-ID", required = false) String mcpUserId,
            @RequestHeader(value = "X-NewMCP-Seller-ID", required = false) String mcpSellerId,
            @RequestHeader(value = "s-id", required = false) String sId,
            @RequestHeader(value = "site-id", required = false) String siteIdHeader,
            @RequestParam(value = "shop_id", required = false) String shopIdParam,
            @RequestParam(value = "site_id", required = false) String siteIdParam) {

        String requestedShopId = resolveRequestedShopId(shopIdParam, siteIdParam, sId, siteIdHeader, mcpSellerId);

        SellerShopsResponse response = sellerWorkspaceService.getShops(
                authHeader,
                mcpUserId,
                mcpSellerId,
                requestedShopId
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/shops")
    public ResponseEntity<CreateShopResponse> createShop(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "X-NewMCP-User-ID", required = false) String mcpUserId,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody CreateShopRequest request) {

        CreateShopResponse response = sellerWorkspaceService.createShop(
                authHeader,
                mcpUserId,
                idempotencyKey,
                request
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/shops/{shop_id}/select")
    public ResponseEntity<SelectShopResponse> selectShop(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "X-NewMCP-User-ID", required = false) String mcpUserId,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @PathVariable("shop_id") String shopId) {

        SelectShopResponse response = sellerWorkspaceService.selectShop(
                authHeader,
                mcpUserId,
                idempotencyKey,
                shopId
        );

        return ResponseEntity.ok(response);
    }
}

