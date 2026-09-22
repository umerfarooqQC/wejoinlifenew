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

    public boolean existsBusinessName(String name, String country) {
        if (name == null || name.isBlank()) {
            return false;
        }
        String sql = "SELECT COUNT(*) FROM " + vconnectDb + ".sellers " +
                     "WHERE (LOWER(business_name) = LOWER(:name) OR LOWER(business_display_name) = LOWER(:name))";
        if (country != null && !country.isBlank()) {
            sql += " AND LOWER(country) = LOWER(:country)";
            Integer count = jdbcClient.sql(sql)
                    .param("name", name.trim())
                    .param("country", country.trim())
                    .query(Integer.class)
                    .optional()
                    .orElse(0);
            return count != null && count > 0;
        } else {
            Integer count = jdbcClient.sql(sql)
                    .param("name", name.trim())
                    .query(Integer.class)
                    .optional()
                    .orElse(0);
            return count != null && count > 0;
        }
    }

    public boolean isEmailTakenByOtherClient(String email, String currentClientUuid) {
        if (email == null || email.isBlank()) {
            return false;
        }
        String sql = "SELECT COUNT(*) FROM " + portalDb + ".clients WHERE LOWER(email) = LOWER(:email)";
        if (currentClientUuid != null && !currentClientUuid.isBlank()) {
            sql += " AND client_uuid != :clientUuid";
            Integer count = jdbcClient.sql(sql)
                    .param("email", email.trim())
                    .param("clientUuid", currentClientUuid.trim())
                    .query(Integer.class)
                    .optional()
                    .orElse(0);
            return count != null && count > 0;
        } else {
            Integer count = jdbcClient.sql(sql)
                    .param("email", email.trim())
                    .query(Integer.class)
                    .optional()
                    .orElse(0);
            return count != null && count > 0;
        }
    }

    public boolean isMobileTakenByOtherClient(String mobile, String currentClientUuid) {
        if (mobile == null || mobile.isBlank()) {
            return false;
        }
        String sql = "SELECT COUNT(*) FROM " + portalDb + ".clients WHERE mobile_number = :mobile";
        if (currentClientUuid != null && !currentClientUuid.isBlank()) {
            sql += " AND client_uuid != :clientUuid";
            Integer count = jdbcClient.sql(sql)
                    .param("mobile", mobile.trim())
                    .param("clientUuid", currentClientUuid.trim())
                    .query(Integer.class)
                    .optional()
                    .orElse(0);
            return count != null && count > 0;
        } else {
            Integer count = jdbcClient.sql(sql)
                    .param("mobile", mobile.trim())
                    .query(Integer.class)
                    .optional()
                    .orElse(0);
            return count != null && count > 0;
        }
    }

    public boolean isDisposableDomain(String email) {
        if (email == null || !email.contains("@")) {
            return false;
        }
        String domain = email.substring(email.indexOf("@") + 1).toLowerCase().trim();
        java.util.Set<String> knownDisposableDomains = java.util.Set.of(
                "tempmail.com", "10minutemail.com", "guerrillamail.com",
                "mailinator.com", "throwawaymail.com", "trashmail.com",
                "sharklasers.com", "dispostable.com", "getairmail.com",
                "temp-mail.org", "fakeinbox.com", "tempail.com",
                "mohmal.com", "mytemp.email"
        );
        if (knownDisposableDomains.contains(domain)) {
            return true;
        }
        try {
            Integer count = jdbcClient.sql("SELECT COUNT(*) FROM vconnect_commons.ignore_email_domains WHERE LOWER(domain) = :domain")
                    .param("domain", domain)
                    .query(Integer.class)
                    .optional()
                    .orElse(0);
            return count != null && count > 0;
        } catch (Exception e) {
            return false;
        }
    }

    public String findCurrencyCodeForCountry(String country) {
        if (country == null || country.isBlank()) {
            return "EUR";
        }
        try {
            String sql = "SELECT currency_code FROM " + vconnectDb + ".countries WHERE LOWER(country_code) = LOWER(:country) LIMIT 1";
            return jdbcClient.sql(sql)
                    .param("country", country.trim())
                    .query(String.class)
                    .optional()
                    .orElse("EUR");
        } catch (Exception e) {
            return "EUR";
        }
    }

    public void insertSeller(
            String sellerUuid,
            String clientUuid,
            String businessName,
            String businessDisplayName,
            String businessType,
            String address,
            String city,
            String state,
            String country,
            String postalCode,
            String contactPerson,
            String contactMobile,
            String email,
            String siret,
            String defaultCurrencyCode,
            String salesModel,
            String raisonDetre,
            String timezone,
            String latitude,
            String longitude
    ) {
        String sql = "INSERT INTO " + vconnectDb + ".sellers (" +
                     "  id, client_uuid, business_name, business_display_name, business_type, " +
                     "  business_address, city, state, country, postal_code, " +
                     "  name, contactPhoneNumber1, email, siret, default_currency_code, " +
                     "  seller_type, comments, remarks, " +
                     "  stype, shop_status, registration_status, " +
                     "  terms_and_conditions_accept, terms_and_conditions_accept_on, " +
                     "  is_prod_env, registered_as_seller, preferred_lang, time_zone, " +
                     "  latitude, longitude, created_on " +
                     ") VALUES (" +
                     "  :id, :clientUuid, :businessName, :businessDisplayName, :businessType, " +
                     "  :address, :city, :state, :country, :postalCode, " +
                     "  :name, :contactMobile, :email, :siret, :defaultCurrencyCode, " +
                     "  :sellerType, :comments, :remarks, " +
                     "  'pro', 'active', 'accepted', " +
                     "  1, NOW(), " +
                     "  0, 1, 'en', :timeZone, " +
                     "  :latitude, :longitude, NOW()" +
                     ")";

        jdbcClient.sql(sql)
                .param("id", sellerUuid)
                .param("clientUuid", clientUuid)
                .param("businessName", businessName)
                .param("businessDisplayName", businessDisplayName)
                .param("businessType", businessType != null && !businessType.isBlank() ? businessType : "business")
                .param("address", address != null ? address : "")
                .param("city", city != null ? city : "")
                .param("state", state != null ? state : "")
                .param("country", country != null ? country : "")
                .param("postalCode", postalCode != null ? postalCode : "")
                .param("name", contactPerson != null ? contactPerson : "")
                .param("contactMobile", contactMobile != null ? contactMobile : "")
                .param("email", email != null ? email : "")
                .param("siret", siret)
                .param("defaultCurrencyCode", defaultCurrencyCode != null && !defaultCurrencyCode.isBlank() ? defaultCurrencyCode : "EUR")
                .param("sellerType", salesModel != null && !salesModel.isBlank() ? salesModel : "both")
                .param("comments", raisonDetre)
                .param("remarks", raisonDetre)
                .param("timeZone", timezone != null && !timezone.isBlank() ? timezone : "UTC")
                .param("latitude", latitude)
                .param("longitude", longitude)
                .update();
    }

    public int insertSite(
            String siteUuid,
            String name,
            String sellerUuid,
            String countryCode
    ) {
        String sql = "INSERT INTO " + portalDb + ".sites (" +
                     "  suid, name, website_name, domain, country_code, " +
                     "  seller_id, created_by, enable_ecommerce, auto_accept_signup, " +
                     "  default_lang, allow_name_change, logo_file, created_on, portal_url " +
                     ") VALUES (" +
                     "  :suid, :name, :name, 'https://www.vconnectlive.com/', :countryCode, " +
                     "  :sellerId, 0, 1, 1, " +
                     "  'en', 1, 'logo.png', NOW(), ''" +
                     ")";

        org.springframework.jdbc.support.GeneratedKeyHolder keyHolder = new org.springframework.jdbc.support.GeneratedKeyHolder();
        jdbcClient.sql(sql)
                .param("suid", siteUuid)
                .param("name", name)
                .param("countryCode", countryCode != null && !countryCode.isBlank() ? countryCode : "fr")
                .param("sellerId", sellerUuid)
                .update(keyHolder, "id");

        Number key = keyHolder.getKey();
        if (key != null) {
            return key.intValue();
        }
        return jdbcClient.sql("SELECT id FROM " + portalDb + ".sites WHERE suid = :suid")
                .param("suid", siteUuid)
                .query(Integer.class)
                .single();
    }

    public void updateSellerSiteId(String sellerUuid, int siteId) {
        String sql = "UPDATE " + vconnectDb + ".sellers SET site_id = :siteId WHERE id = :sellerUuid";
        jdbcClient.sql(sql)
                .param("siteId", siteId)
                .param("sellerUuid", sellerUuid)
                .update();
    }

    public void insertClientSeller(String clientUuid, String sellerUuid) {
        String sql = "INSERT IGNORE INTO " + portalDb + ".clients_sellers (client_uuid, seller_id, tm) " +
                     "VALUES (:clientUuid, :sellerUuid, NOW())";
        jdbcClient.sql(sql)
                .param("clientUuid", clientUuid)
                .param("sellerUuid", sellerUuid)
                .update();
    }

    public void insertSellerCategories(String sellerUuid, List<String> categoryIds) {
        if (categoryIds == null || categoryIds.isEmpty()) {
            return;
        }
        String sql = "INSERT IGNORE INTO " + vconnectDb + ".seller_categories (seller_id, category_id) VALUES (:sellerUuid, :categoryId)";
        for (String catId : categoryIds) {
            if (catId != null && !catId.isBlank()) {
                jdbcClient.sql(sql)
                        .param("sellerUuid", sellerUuid)
                        .param("categoryId", catId.trim())
                        .update();
            }
        }
    }

    public void insertSellerShopLocation(
            String locationId,
            String sellerUuid,
            String name,
            String address,
            String city,
            String state,
            String country,
            String postalCode,
            String contact,
            String latitude,
            String longitude
    ) {
        String sql = "INSERT INTO " + vconnectDb + ".seller_shops (" +
                     "  id, seller_id, name, address, city, state, country, postal_code, contact, latitude, longitude " +
                     ") VALUES (" +
                     "  :id, :sellerUuid, :name, :address, :city, :state, :country, :postalCode, :contact, :latitude, :longitude " +
                     ")";
        jdbcClient.sql(sql)
                .param("id", locationId)
                .param("sellerUuid", sellerUuid)
                .param("name", name)
                .param("address", address != null ? address : "")
                .param("city", city != null ? city : "")
                .param("state", state != null ? state : "")
                .param("country", country != null ? country : "")
                .param("postalCode", postalCode != null ? postalCode : "")
                .param("contact", contact != null ? contact : "")
                .param("latitude", latitude)
                .param("longitude", longitude)
                .update();
    }

    public void insertSellerPayment(String sellerUuid) {
        String paymentId = java.util.UUID.randomUUID().toString();
        String sql = "INSERT INTO " + vconnectDb + ".seller_payments (" +
                     "  id, seller_id, payment_method, payment_status" +
                     ") VALUES (" +
                     "  :id, :sellerUuid, 'free_package', 'pending'" +
                     ")";
        jdbcClient.sql(sql)
                .param("id", paymentId)
                .param("sellerUuid", sellerUuid)
                .update();

        jdbcClient.sql("UPDATE " + vconnectDb + ".sellers SET last_payment_id = :paymentId WHERE id = :sellerUuid")
                .param("paymentId", paymentId)
                .param("sellerUuid", sellerUuid)
                .update();
    }

    public void insertPostWork(String sellerUuid) {
        String sql = "INSERT INTO " + vconnectDb + ".post_work (" +
                     "  priority, proces, phase, insertion_date, client_key" +
                     ") VALUES (" +
                     "  NOW(), 'sellerregister', 'new_request', NOW(), :sellerUuid" +
                     ")";
        jdbcClient.sql(sql)
                .param("sellerUuid", sellerUuid)
                .update();
    }

    public void updateSellerTermsAndActiveSite(String clientUuid, int siteId) {
        try {
            String sql1 = "UPDATE " + vconnectDb + ".sellers SET " +
                          "terms_and_conditions_accept = 1, " +
                          "terms_and_conditions_accept_on = NOW() " +
                          "WHERE site_id = :siteId";
            jdbcClient.sql(sql1)
                    .param("siteId", siteId)
                    .update();
        } catch (Exception ignored) {
        }

        if (clientUuid != null && !clientUuid.isBlank()) {
            try {
                String sql2 = "UPDATE " + vconnectDb + ".sellers SET " +
                              "terms_and_conditions_accept = 1, " +
                              "terms_and_conditions_accept_on = NOW() " +
                              "WHERE client_uuid = :clientUuid AND site_id = :siteId";
                jdbcClient.sql(sql2)
                        .param("clientUuid", clientUuid.trim())
                        .param("siteId", siteId)
                        .update();
            } catch (Exception ignored) {
            }
        }

        try {
            String sql3 = "UPDATE " + catalogDb + ".login SET " +
                          "last_site_id = :siteId, " +
                          "accept_terms_conditions = 1, " +
                          "accept_terms_conditions_on = NOW() " +
                          "WHERE (client_uuid = :clientUuid OR pid = :clientUuid)";
            jdbcClient.sql(sql3)
                    .param("siteId", siteId)
                    .param("clientUuid", clientUuid != null ? clientUuid : "")
                    .update();
        } catch (Exception ignored) {
        }

        try {
            String sql4 = "UPDATE " + portalDb + ".clients SET " +
                          "last_site_id = :siteId " +
                          "WHERE client_uuid = :clientUuid";
            jdbcClient.sql(sql4)
                    .param("siteId", siteId)
                    .param("clientUuid", clientUuid != null ? clientUuid : "")
                    .update();
        } catch (Exception ignored) {
        }
    }
}

