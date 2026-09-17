package com.wejoinlife.api.repository;

import com.wejoinlife.api.model.CatalogRecord;
import com.wejoinlife.api.model.SiteRecord;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.*;

@Repository
@RequiredArgsConstructor
public class ProductAdminRepository {

    private final JdbcClient jdbcClient;

    @Value("${application.database.portal-db:vconnect_prod_portal}")
    private String portalDb;

    @Value("${application.database.catalog-db:vconnect_prod_catalog}")
    private String catalogDb;

    public Optional<SiteRecord> findSiteBySuid(String siteUuid) {
        String sql = "SELECT id, suid, name, country_code AS countryCode, default_lang AS defaultLang, created_by AS createdBy " +
                     "FROM " + portalDb + ".sites WHERE suid = :suid";
        return jdbcClient.sql(sql)
                .param("suid", siteUuid)
                .query(SiteRecord.class)
                .optional();
    }

    public Optional<SiteRecord> findSiteById(Integer siteId) {
        if (siteId == null) {
            return Optional.empty();
        }
        String sql = "SELECT id, suid, name, country_code AS countryCode, default_lang AS defaultLang, created_by AS createdBy " +
                     "FROM " + portalDb + ".sites WHERE id = :id";
        return jdbcClient.sql(sql)
                .param("id", siteId)
                .query(SiteRecord.class)
                .optional();
    }

    public Optional<SiteRecord> findSiteByIdOrSuid(String identifier) {
        if (identifier == null || identifier.isBlank()) {
            return Optional.empty();
        }
        String sql = "SELECT id, suid, name, country_code AS countryCode, default_lang AS defaultLang, created_by AS createdBy " +
                     "FROM " + portalDb + ".sites WHERE suid = :identifier OR id = :identifier LIMIT 1";
        return jdbcClient.sql(sql)
                .param("identifier", identifier.trim())
                .query(SiteRecord.class)
                .optional();
    }

    public Optional<CatalogRecord> findCatalogById(String catalogId) {
        String sql = "SELECT id, name, catalog_type AS catalogType, site_id AS siteId " +
                     "FROM " + catalogDb + ".catalogs WHERE id = :id";
        return jdbcClient.sql(sql)
                .param("id", catalogId)
                .query(CatalogRecord.class)
                .optional();
    }

    public int findLanguageIdByCode(String code) {
        if (code == null || code.isBlank()) {
            return 1;
        }
        try {
            String sql = "SELECT langue_id FROM " + catalogDb + ".language WHERE LOWER(langue_code) = LOWER(:code) LIMIT 1";
            return jdbcClient.sql(sql)
                    .param("code", code.trim())
                    .query(Integer.class)
                    .optional()
                    .orElse(1);
        } catch (Exception e) {
            return 1;
        }
    }

    public void insertProduct(String productId, String catalogId, String productUuid,
                              String productType, int showQuickbuy, int langueId,
                              String name, String summary, String features,
                              String price, int stock, int createdBy) {
        String sql = "INSERT INTO " + catalogDb + ".products (" +
                     "id, catalog_id, product_uuid, product_type, show_basket, show_quickbuy, " +
                     "is_permanent, version, combined_name, default_langue_id, default_name, " +
                     "default_summary, default_main_features, price, stock, " +
                     "created_by, created_on" +
                     ") VALUES (" +
                     ":id, :catalogId, :productUuid, :productType, 1, :showQuickbuy, " +
                     "1, 1, :combinedName, :langueId, :name, " +
                     ":summary, :features, :price, :stock, " +
                     ":createdBy, NOW())";

        jdbcClient.sql(sql)
                .param("id", productId)
                .param("catalogId", catalogId)
                .param("productUuid", productUuid)
                .param("productType", productType)
                .param("showQuickbuy", showQuickbuy)
                .param("combinedName", name)
                .param("langueId", langueId)
                .param("name", name)
                .param("summary", summary)
                .param("features", features)
                .param("price", price)
                .param("stock", stock)
                .param("createdBy", createdBy)
                .update();
    }

    public int insertProductVariant(String productId, String variantUuid, String sku,
                                    BigDecimal price, int stock, int createdBy) {
        String sql = "INSERT INTO " + catalogDb + ".product_variants (" +
                     "product_id, uuid, sku, is_active, is_default, is_show_price, price, stock, created_by, created_on, order_seq" +
                     ") VALUES (" +
                     ":productId, :uuid, :sku, 1, 1, 1, :price, :stock, :createdBy, NOW(), 1)";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcClient.sql(sql)
                .param("productId", productId)
                .param("uuid", variantUuid)
                .param("sku", sku)
                .param("price", price)
                .param("stock", stock)
                .param("createdBy", createdBy)
                .update(keyHolder, "id");

        Number key = keyHolder.getKey();
        if (key != null) {
            return key.intValue();
        }

        // Fallback: look up by unique variant uuid
        String lookupSql = "SELECT id FROM " + catalogDb + ".product_variants WHERE uuid = :uuid";
        return jdbcClient.sql(lookupSql)
                .param("uuid", variantUuid)
                .query(Integer.class)
                .single();
    }

    public void insertProductVariantDetails(int variantId, int langueId, String name, String features) {
        String sql = "INSERT INTO " + catalogDb + ".product_variant_details (" +
                     "product_variant_id, langue_id, name, main_features" +
                     ") VALUES (:variantId, :langueId, :name, :features) " +
                     "ON DUPLICATE KEY UPDATE name = :name, main_features = :features";

        jdbcClient.sql(sql)
                .param("variantId", variantId)
                .param("langueId", langueId)
                .param("name", name)
                .param("features", features)
                .update();
    }

    public void insertProductDescriptions(String productId, int langueId, String summary,
                                          String features, String pagePath, String seoTitle) {
        String seoCanonicalUrl = pagePath + ".html";
        String sql = "INSERT INTO " + catalogDb + ".product_descriptions (" +
                     "product_id, langue_id, summary, main_features, video_url, essentials_alignment, page_path, seo_title, seo_canonical_url" +
                     ") VALUES (" +
                     ":productId, :langueId, :summary, :features, '', '', :pagePath, :seoTitle, :seoCanonicalUrl" +
                     ") ON DUPLICATE KEY UPDATE summary = :summary, main_features = :features, seo_title = :seoTitle";

        jdbcClient.sql(sql)
                .param("productId", productId)
                .param("langueId", langueId)
                .param("summary", summary)
                .param("features", features)
                .param("pagePath", pagePath)
                .param("seoTitle", seoTitle)
                .param("seoCanonicalUrl", seoCanonicalUrl)
                .update();
    }

    public void insertCatalogAttributeRefs(int variantId, String catalogId) {
        String sql = "INSERT INTO " + catalogDb + ".product_variant_ref (product_variant_id, cat_attrib_id, catalog_attribute_value_id) " +
                     "SELECT :variantId, cat_attrib_id, 0 FROM " + catalogDb + ".catalog_attributes WHERE catalog_id = :catalogId";
        jdbcClient.sql(sql)
                .param("variantId", variantId)
                .param("catalogId", catalogId)
                .update();
    }

    public void insertProductTags(String productId, List<String> tags, int createdBy) {
        if (tags == null || tags.isEmpty()) {
            return;
        }

        String sql = "INSERT IGNORE INTO " + catalogDb + ".product_tags (product_id, tag_id, created_by, created_on) " +
                     "VALUES (:productId, :tagId, :createdBy, NOW())";

        for (String tag : tags) {
            if (tag == null || tag.isBlank()) {
                continue;
            }
            String cleanTag = tag.startsWith("@") ? tag.substring(1).trim() : tag.trim();
            if (!cleanTag.isEmpty()) {
                jdbcClient.sql(sql)
                        .param("productId", productId)
                        .param("tagId", cleanTag)
                        .param("createdBy", createdBy)
                        .update();
            }
        }
    }

    public Map<String, Object> getVariantDetails(String siteId, String productId, int variantId, int langueId) {
        String sql = "SELECT p.id AS product_id, p.catalog_id, c.name AS catalog_name, c.catalog_type, " +
                     "COALESCE(pvd.name, p.default_name, p.combined_name, '') AS product_name, " +
                     "pv.sku, pv.price, pv.stock " +
                     "FROM " + catalogDb + ".products p " +
                     "JOIN " + catalogDb + ".catalogs c ON c.id = p.catalog_id " +
                     "JOIN " + catalogDb + ".product_variants pv ON pv.product_id = p.id " +
                     "LEFT JOIN " + catalogDb + ".product_variant_details pvd ON pvd.product_variant_id = pv.id AND pvd.langue_id = :langueId " +
                     "WHERE p.id = :productId AND pv.id = :variantId";

        var baseRowOpt = jdbcClient.sql(sql)
                .param("productId", productId)
                .param("variantId", variantId)
                .param("langueId", langueId)
                .query()
                .listOfRows();

        if (baseRowOpt.isEmpty()) {
            return null;
        }

        Map<String, Object> row = baseRowOpt.get(0);

        // Fetch description
        String descSql = "SELECT summary, main_features FROM " + catalogDb + ".product_descriptions " +
                         "WHERE product_id = :productId AND langue_id = :langueId";
        var descRows = jdbcClient.sql(descSql)
                .param("productId", productId)
                .param("langueId", langueId)
                .query()
                .listOfRows();

        String summary = descRows.isEmpty() ? "" : (String) descRows.get(0).getOrDefault("summary", "");
        String features = descRows.isEmpty() ? "" : (String) descRows.get(0).getOrDefault("main_features", "");

        // Fetch tags
        String tagsSql = "SELECT tag_id FROM " + catalogDb + ".product_tags WHERE product_id = :productId";
        List<String> tagIds = jdbcClient.sql(tagsSql)
                .param("productId", productId)
                .query(String.class)
                .list();

        List<Map<String, String>> tagsList = new ArrayList<>();
        for (String tagId : tagIds) {
            tagsList.add(Map.of(
                    "id", tagId,
                    "label", tagId
            ));
        }

        Map<String, Object> productObj = new LinkedHashMap<>();
        productObj.put("id", row.get("product_id"));
        productObj.put("catalog_id", row.get("catalog_id"));
        productObj.put("catalog_name", row.get("catalog_name"));
        productObj.put("catalog_type", row.get("catalog_type"));
        productObj.put("name", row.get("product_name"));
        productObj.put("sku", row.get("sku"));
        productObj.put("global_sku", "");
        productObj.put("summary", summary != null ? summary : "");
        productObj.put("features", features != null ? features : "");

        Map<String, Object> variantMap = new LinkedHashMap<>();
        variantMap.put("id", String.valueOf(variantId));
        variantMap.put("price", String.valueOf(row.get("price")));
        variantMap.put("price_unit", "item");
        variantMap.put("price_unit_quantity", "1");
        variantMap.put("stock", String.valueOf(row.get("stock")));
        variantMap.put("tags", tagsList);
        variantMap.put("videos", List.of());
        variantMap.put("resources", List.of());
        variantMap.put("product", productObj);

        return variantMap;
    }
}

