package com.wejoinlife.api.controller.seller;

import com.wejoinlife.api.dto.seller.SellerWorkspaceResponse;
import com.wejoinlife.api.service.SellerWorkspaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/v1/seller", "/api/v1/seller"})
@RequiredArgsConstructor
public class SellerWorkspaceController {

    private final SellerWorkspaceService sellerWorkspaceService;

    @GetMapping("/workspace")
    public ResponseEntity<SellerWorkspaceResponse> getWorkspace(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "X-NewMCP-User-ID", required = false) String mcpUserId,
            @RequestHeader(value = "X-NewMCP-Seller-ID", required = false) String mcpSellerId,
            @RequestHeader(value = "s-id", required = false) String sId,
            @RequestHeader(value = "site-id", required = false) String siteIdHeader,
            @RequestParam(value = "shop_id", required = false) String shopIdParam,
            @RequestParam(value = "site_id", required = false) String siteIdParam) {

        String requestedShopId = null;
        if (shopIdParam != null && !shopIdParam.isBlank()) {
            requestedShopId = shopIdParam;
        } else if (siteIdParam != null && !siteIdParam.isBlank()) {
            requestedShopId = siteIdParam;
        } else if (sId != null && !sId.isBlank()) {
            requestedShopId = sId;
        } else if (siteIdHeader != null && !siteIdHeader.isBlank()) {
            requestedShopId = siteIdHeader;
        } else if (mcpSellerId != null && !mcpSellerId.isBlank()) {
            requestedShopId = mcpSellerId;
        }

        SellerWorkspaceResponse response = sellerWorkspaceService.getWorkspace(
                authHeader,
                mcpUserId,
                mcpSellerId,
                requestedShopId
        );

        return ResponseEntity.ok(response);
    }
}

