package com.wejoinlife.api.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class SellerCatalogPriceRepository {

    private final JdbcClient jdbcClient;

    @Value("${application.database.catalog-db:vconnect_prod_catalog}")
    private String catalogDb;

    public Optional<Map<String, Object>> findListingById(String listingId) {
        String sql = "SELECT p.id, p.catalog_id, COALESCE(p.default_name, p.combined_name) AS name FROM "
                + catalogDb + ".products p WHERE p.id = :listingId LIMIT 1";

        return jdbcClient.sql(sql)
                .param("listingId", listingId)
                .query()
                .listOfRows()
                .stream()
                .findFirst();
    }

    public Optional<Map<String, Object>> findVariantById(String variantId, String listingId) {
        String sql = "SELECT pv.id, pv.product_id, pv.price, pv.currency_code FROM " + catalogDb + ".product_variants pv "
                + "WHERE pv.id = :variantId AND pv.product_id = :listingId LIMIT 1";

        return jdbcClient.sql(sql)
                .param("variantId", variantId)
                .param("listingId", listingId)
                .query()
                .listOfRows()
                .stream()
                .findFirst();
    }

    public int updatePriceIfMatches(String variantId, String listingId, BigDecimal expectedPrice, BigDecimal newPrice, String currencyCode) {
        String sql = "UPDATE " + catalogDb + ".product_variants "
                + "SET price = :newPrice, currency_code = :currencyCode, updated_on = NOW() "
                + "WHERE id = :variantId AND product_id = :listingId AND CAST(price AS DECIMAL(18,4)) = CAST(:expectedPrice AS DECIMAL(18,4))";

        return jdbcClient.sql(sql)
                .param("variantId", variantId)
                .param("listingId", listingId)
                .param("expectedPrice", expectedPrice)
                .param("newPrice", newPrice)
                .param("currencyCode", currencyCode)
                .update();
    }

    public Optional<Map<String, Object>> fetchUpdatedVariant(String variantId, String listingId) {
        String sql = "SELECT pv.id, pv.product_id, pv.price, pv.currency_code FROM " + catalogDb + ".product_variants pv "
                + "WHERE pv.id = :variantId AND pv.product_id = :listingId LIMIT 1";

        return jdbcClient.sql(sql)
                .param("variantId", variantId)
                .param("listingId", listingId)
                .query()
                .listOfRows()
                .stream()
                .findFirst();
    }
}
