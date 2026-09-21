package com.wejoinlife.api.repository;

import com.wejoinlife.api.dto.seller.SellerWorkspaceResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class SellerWorkspaceRepository {

    private final JdbcClient jdbcClient;

    @Value("${application.database.portal-db:vconnect_prod_portal}")
    private String portalDb;

    @Value("${application.database.vconnect-db:vconnect}")
    private String vconnectDb;

    @Value("${application.database.catalog-db:vconnect_prod_catalog}")
    private String catalogDb;

    public record ShopRecord(
            int siteId,
            String siteName,
            String sellerUuid,
            String businessName,
            String businessDisplayName,
            String shopStatus,
            String businessType,
            Integer isOpen
    ) {
        public String resolveDisplayName() {
            if (businessDisplayName != null && !businessDisplayName.isBlank()) {
                return businessDisplayName.trim();
            }
            if (businessName != null && !businessName.isBlank()) {
                return businessName.trim();
            }
            if (siteName != null && !siteName.isBlank()) {
                return siteName.trim();
            }
            return "Shop #" + siteId;
        }

        public String resolveStatus() {
            if (shopStatus != null && !shopStatus.isBlank()) {
                return shopStatus.trim();
            }
            return "active";
        }

        public String resolveBusinessType() {
            if (businessType != null && !businessType.isBlank()) {
                return businessType.trim();
            }
            return "business";
        }

        public boolean resolveIsOpen() {
            return isOpen == null || isOpen == 1;
        }
    }

    public List<ShopRecord> findShopsBySiteIds(List<Integer> siteIds) {
        if (siteIds == null || siteIds.isEmpty()) {
            return List.of();
        }

        String sql = "SELECT " +
                     "  st.id AS siteId, " +
                     "  st.name AS siteName, " +
                     "  sl.id AS sellerUuid, " +
                     "  sl.business_name AS businessName, " +
                     "  sl.business_display_name AS businessDisplayName, " +
                     "  sl.shop_status AS shopStatus, " +
                     "  sl.business_type AS businessType, " +
                     "  sl.is_open AS isOpen " +
                     "FROM " + portalDb + ".sites st " +
                     "LEFT JOIN " + vconnectDb + ".sellers sl ON (sl.site_id = st.id OR sl.id = st.seller_id) " +
                     "WHERE st.id IN (:siteIds) " +
                     "ORDER BY st.id";

        return jdbcClient.sql(sql)
                .param("siteIds", siteIds)
                .query(ShopRecord.class)
                .list();
    }

    public Optional<ShopRecord> findShopBySiteId(int siteId) {
        String sql = "SELECT " +
                     "  st.id AS siteId, " +
                     "  st.name AS siteName, " +
                     "  sl.id AS sellerUuid, " +
                     "  sl.business_name AS businessName, " +
                     "  sl.business_display_name AS businessDisplayName, " +
                     "  sl.shop_status AS shopStatus, " +
                     "  sl.business_type AS businessType, " +
                     "  sl.is_open AS isOpen " +
                     "FROM " + portalDb + ".sites st " +
                     "LEFT JOIN " + vconnectDb + ".sellers sl ON (sl.site_id = st.id OR sl.id = st.seller_id) " +
                     "WHERE st.id = :siteId " +
                     "LIMIT 1";

        return jdbcClient.sql(sql)
                .param("siteId", siteId)
                .query(ShopRecord.class)
                .optional();
    }

    public List<SellerWorkspaceResponse.LocationInfo> findLocations(String sellerUuid, int siteId, String fallbackName, boolean isOpen) {
        List<SellerWorkspaceResponse.LocationInfo> locations = new ArrayList<>();

        if (sellerUuid != null && !sellerUuid.isBlank()) {
            String sql = "SELECT id, name FROM " + vconnectDb + ".seller_shops WHERE seller_id = :sellerUuid";
            var rows = jdbcClient.sql(sql)
                    .param("sellerUuid", sellerUuid)
                    .query()
                    .listOfRows();

            for (Map<String, Object> row : rows) {
                String locId = String.valueOf(row.get("id"));
                String locName = (String) row.get("name");
                locations.add(new SellerWorkspaceResponse.LocationInfo(
                        locId,
                        locName != null && !locName.isBlank() ? locName : "Shop Location",
                        isOpen ? "open" : "closed"
                ));
            }
        }

        if (locations.isEmpty()) {
            locations.add(new SellerWorkspaceResponse.LocationInfo(
                    String.valueOf(siteId),
                    fallbackName != null && !fallbackName.isBlank() ? fallbackName : "Main shop",
                    isOpen ? "open" : "closed"
            ));
        }

        return locations;
    }

    public List<String> findCategoryIds(String sellerUuid) {
        if (sellerUuid == null || sellerUuid.isBlank()) {
            return List.of();
        }
        String sql = "SELECT DISTINCT category_id FROM " + vconnectDb + ".seller_categories " +
                     "WHERE seller_id = :sellerUuid AND category_id IS NOT NULL AND category_id != ''";
        return jdbcClient.sql(sql)
                .param("sellerUuid", sellerUuid)
                .query(String.class)
                .list();
    }

    public List<SellerWorkspaceResponse.CategoryOption> findCategoryOptions(String sellerUuid) {
        String sql;
        if (sellerUuid != null && !sellerUuid.isBlank()) {
            sql = "SELECT id, name, category_type AS vertical FROM " + vconnectDb + ".categories " +
                  "WHERE parent_category_id IS NULL " +
                  "   OR id IN (SELECT category_id FROM " + vconnectDb + ".seller_categories WHERE seller_id = :sellerUuid) " +
                  "ORDER BY name LIMIT 50";
            return jdbcClient.sql(sql)
                    .param("sellerUuid", sellerUuid)
                    .query((rs, rowNum) -> new SellerWorkspaceResponse.CategoryOption(
                            rs.getString("id"),
                            rs.getString("name"),
                            rs.getString("vertical") != null ? rs.getString("vertical") : "general"
                    ))
                    .list();
        } else {
            sql = "SELECT id, name, category_type AS vertical FROM " + vconnectDb + ".categories " +
                  "WHERE parent_category_id IS NULL ORDER BY name LIMIT 50";
            return jdbcClient.sql(sql)
                    .query((rs, rowNum) -> new SellerWorkspaceResponse.CategoryOption(
                            rs.getString("id"),
                            rs.getString("name"),
                            rs.getString("vertical") != null ? rs.getString("vertical") : "general"
                    ))
                    .list();
        }
    }

    public int countActiveListings(int siteId) {
        try {
            String sql = "SELECT COUNT(*) FROM " + catalogDb + ".products p " +
                         "JOIN " + catalogDb + ".catalogs c ON c.id = p.catalog_id " +
                         "WHERE c.site_id = :siteId AND (p.is_available = 1 OR p.is_available IS NULL)";
            Integer count = jdbcClient.sql(sql)
                    .param("siteId", siteId)
                    .query(Integer.class)
                    .optional()
                    .orElse(0);
            return count != null ? count : 0;
        } catch (Exception e) {
            return 0;
        }
    }
}

