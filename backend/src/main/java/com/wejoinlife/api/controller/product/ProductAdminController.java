package com.wejoinlife.api.controller.product;

import com.wejoinlife.api.dto.product.AddProductRequest;
import com.wejoinlife.api.dto.product.ProductActionResponse;
import com.wejoinlife.api.service.ProductAdminService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping({"/wjlapi/api/v1/products", "/wjlapi/v1/products", "/wjlapi/api/v1/adm", "/wjlapi/v1/adm", "/api/v1/products", "/api/v1/adm"})
@RequiredArgsConstructor
public class ProductAdminController {

    private final ProductAdminService productAdminService;

    @PostMapping(value = {"/add", "/saveproduct", "/addproduct"}, consumes = {MediaType.APPLICATION_JSON_VALUE, "*/*"})
    public ResponseEntity<ProductActionResponse> addProductJson(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "site-uid", required = false) String siteUid,
            @RequestHeader(value = "s-id", required = false) String sId,
            @RequestHeader(value = "site-id", required = false) String siteId,
            @RequestBody(required = false) AddProductRequest jsonRequest) {

        String siteIdentifier = resolveSiteIdentifier(sId, siteId, siteUid, null);

        AddProductRequest effectiveRequest = (jsonRequest != null)
                ? jsonRequest
                : new AddProductRequest(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);

        ProductActionResponse response = productAdminService.addProduct(authHeader, siteIdentifier, effectiveRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = {"/add", "/saveproduct", "/addproduct"}, consumes = {MediaType.APPLICATION_FORM_URLENCODED_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<ProductActionResponse> addProductForm(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "site-uid", required = false) String siteUid,
            @RequestHeader(value = "s-id", required = false) String sId,
            @RequestHeader(value = "site-id", required = false) String siteId,
            HttpServletRequest request) {

        String siteParam = request.getParameter("s-id");
        if (siteParam == null) siteParam = request.getParameter("site_id");
        if (siteParam == null) siteParam = request.getParameter("site-uid");
        String siteIdentifier = resolveSiteIdentifier(sId, siteId, siteUid, siteParam);

        String catalogId = request.getParameter("catalog_id");
        if (catalogId == null) catalogId = request.getParameter("catalogId");

        String name = request.getParameter("name");
        String price = request.getParameter("price");
        String priceUnit = request.getParameter("price_unit");
        String priceUnitQuantity = request.getParameter("price_unit_quantity");
        String productCondition = request.getParameter("product_condition");
        String productSubtype = request.getParameter("product_subtype");
        String stock = request.getParameter("stock");
        String summary = request.getParameter("summary");
        String features = request.getParameter("features");
        String showQuickbuy = request.getParameter("show_quickbuy");
        String sku = request.getParameter("sku");
        String globalSku = request.getParameter("global_sku");
        String lang = request.getParameter("lang");

        String[] tagsArr = request.getParameterValues("productTags");
        if (tagsArr == null) tagsArr = request.getParameterValues("product_tags");
        List<String> tags = tagsArr != null ? Arrays.asList(tagsArr) : null;

        String cpid = request.getParameter("cpid");
        String cvid = request.getParameter("cvid");

        AddProductRequest formRequest = new AddProductRequest(
                catalogId, name, price, priceUnit, priceUnitQuantity,
                productCondition, productSubtype, stock, summary, features,
                showQuickbuy, sku, globalSku, lang, tags, cpid, cvid
        );

        ProductActionResponse response = productAdminService.addProduct(authHeader, siteIdentifier, formRequest);
        return ResponseEntity.ok(response);
    }

    private String resolveSiteIdentifier(String sId, String siteId, String siteUid, String siteParam) {
        if (sId != null && !sId.isBlank()) return sId.trim();
        if (siteId != null && !siteId.isBlank()) return siteId.trim();
        if (siteUid != null && !siteUid.isBlank()) return siteUid.trim();
        if (siteParam != null && !siteParam.isBlank()) return siteParam.trim();
        return null;
    }
}

