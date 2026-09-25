package com.wejoinlife.api.repository;

import com.wejoinlife.api.model.ClientUser;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class AuthRepository {

    private final JdbcClient jdbcClient;

    @Value("${application.database.portal-db:vconnect_prod_portal}")
    private String portalDb;

    @Value("${application.database.vconnect-db:vconnect}")
    private String vconnectDb;

    public Optional<ClientUser> findByEmailOrUsername(String identifier) {
        String sql = "SELECT id, client_uuid AS clientUuid, email, pass, " +
                     "is_verified AS isVerified, is_super_user AS isSuperUser, " +
                     "client_profil_id AS clientProfilId " +
                     "FROM " + portalDb + ".clients " +
                     "WHERE is_active = 1 AND (email = :identifier OR username = :identifier) " +
                     "LIMIT 1";
        return jdbcClient.sql(sql)
                .param("identifier", identifier)
                .query(ClientUser.class)
                .optional();
    }

    public Optional<ClientUser> findByEmail(String email) {
        return findByEmailOrUsername(email);
    }

    public boolean isSeller(String clientUuid) {
        if (clientUuid == null || clientUuid.isBlank()) {
            return false;
        }
        String sql = "SELECT COUNT(*) FROM (" +
                     "  SELECT id FROM " + vconnectDb + ".sellers WHERE client_uuid = :clientUuid " +
                     "  UNION " +
                     "  SELECT seller_id AS id FROM " + portalDb + ".clients_sellers WHERE client_uuid = :clientUuid " +
                     ") t";
        Integer count = jdbcClient.sql(sql)
                .param("clientUuid", clientUuid)
                .query(Integer.class)
                .optional()
                .orElse(0);
        return count > 0;
    }

    public List<Integer> findSellerSiteIds(String clientUuid) {
        if (clientUuid == null || clientUuid.isBlank()) {
            return List.of();
        }
        String sql = "SELECT DISTINCT site_id FROM " + vconnectDb + ".sellers s " +
                     "WHERE s.client_uuid = :clientUuid AND s.site_id IS NOT NULL ORDER BY site_id";
        return jdbcClient.sql(sql)
                .param("clientUuid", clientUuid)
                .query(Integer.class)
                .list();
    }

    public void updateLastLogin(String clientId) {
        String sql = "UPDATE " + portalDb + ".clients SET last_login_on = NOW() WHERE id = :id";
        jdbcClient.sql(sql)
                .param("id", clientId)
                .update();
    }

    public void saveRememberMeToken(String tokenId, String validator, String clientUuid) {
        String sql = "INSERT INTO " + portalDb + ".auth_tokens (id, validator, client_uuid, expiry) " +
                     "VALUES (:id, SHA2(:validator, 256), :clientUuid, ADDDATE(NOW(), INTERVAL 7 DAY))";
        jdbcClient.sql(sql)
                .param("id", tokenId)
                .param("validator", validator)
                .param("clientUuid", clientUuid)
                .update();
    }
}
