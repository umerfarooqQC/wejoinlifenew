package com.wejoinlife.api.dto.product;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record AddProductRequest(
    @JsonAlias({"catalog_id", "catalogId"})
    String catalogId,

    String name,

    String price,

    @JsonAlias({"price_unit", "priceUnit"})
    String priceUnit,

    @JsonAlias({"price_unit_quantity", "priceUnitQuantity"})
    String priceUnitQuantity,

    @JsonAlias({"product_condition", "productCondition"})
    String productCondition,

    @JsonAlias({"product_subtype", "productSubtype", "sub_type"})
    String productSubtype,

    String stock,

    String summary,

    String features,

    @JsonAlias({"show_quickbuy", "showQuickbuy"})
    String showQuickbuy,

    String sku,

    @JsonAlias({"global_sku", "globalSku"})
    String globalSku,

    String lang,

    @JsonAlias({"productTags", "product_tags", "tags"})
    List<String> productTags,

    String cpid,
    String cvid
) {
    public String getEffectiveCatalogId() {
        return catalogId != null ? catalogId.trim() : "";
    }

    public String getEffectiveName() {
        return name != null ? name.trim() : "";
    }

    public String getEffectivePrice() {
        return (price != null && !price.isBlank()) ? price.trim() : "0.00";
    }

    public String getEffectivePriceUnit() {
        return (priceUnit != null && !priceUnit.isBlank()) ? priceUnit : "item";
    }

    public String getEffectivePriceUnitQuantity() {
        return (priceUnitQuantity != null && !priceUnitQuantity.isBlank()) ? priceUnitQuantity : "1";
    }

    public String getEffectiveProductCondition() {
        return (productCondition != null && !productCondition.isBlank()) ? productCondition : "new_with_packing";
    }

    public String getEffectiveProductSubtype() {
        return (productSubtype != null && !productSubtype.isBlank()) ? productSubtype : "normal";
    }

    public String getEffectiveStock() {
        return (stock != null && !stock.isBlank()) ? stock : "1000000";
    }

    public String getEffectiveSummary() {
        return summary != null ? summary : "";
    }

    public String getEffectiveFeatures() {
        return features != null ? features : "";
    }

    public String getEffectiveShowQuickbuy() {
        return showQuickbuy != null ? showQuickbuy : "0";
    }

    public String getEffectiveSku(String suggestedName) {
        if (sku != null && !sku.isBlank()) {
            return sku.trim();
        }
        return suggestedName + "sku";
    }

    public String getEffectiveGlobalSku() {
        return globalSku != null ? globalSku.trim() : "";
    }
}

