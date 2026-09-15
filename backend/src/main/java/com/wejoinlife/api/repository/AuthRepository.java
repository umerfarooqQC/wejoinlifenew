package com.wejoinlife.api.repository;

import com.wejoinlife.api.model.ClientUser;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class AuthRepository {

    private final JdbcClient jdbcClient;

    @Value("${application.database.portal-db:vconnect_prod_portal}")
    private String portalDb;

    public Optional<ClientUser> findByEmail(String email) {
        String sql = "SELECT id, client_uuid AS clientUuid, email, pass, " +
                     "is_verified AS isVerified, is_super_user AS isSuperUser, " +
                     "client_profil_id AS clientProfilId " +
                     "FROM " + portalDb + ".clients " +
                     "WHERE site_id = 0 AND email = :email";
        return jdbcClient.sql(sql)
                .param("email", email)
                .query(ClientUser.class)
                .optional();
    }


    public void updateLastLogin(String clientId) {
        String sql = "UPDATE " + portalDb + ".clients SET last_login_on = NOW() WHERE id = :id";
        jdbcClient.sql(sql)
                .param("id", clientId)
                .update();
    }

    public Optional<String> findActiveCartSession(String clientId) {
        String sql = "SELECT c.session_id " +
                     "FROM " + portalDb + ".cart c " +
                     "INNER JOIN " + portalDb + ".cart_items ci ON c.id = ci.cart_id " +
                     "WHERE c.client_id = :clientId " +
                     "LIMIT 1";
        return jdbcClient.sql(sql)
                .param("clientId", clientId)
                .query(String.class)
                .optional();
    }

    public void deleteEmptyCarts(String clientId) {
        String sql = "DELETE FROM " + portalDb + ".cart WHERE client_id = :clientId AND id NOT IN (SELECT cart_id FROM " + portalDb + ".cart_items)";
        jdbcClient.sql(sql)
                .param("clientId", clientId)
                .update();
    }

    public void assignGuestCartToClient(String clientId, String guestSessionId) {
        String sql = "UPDATE " + portalDb + ".cart SET client_id = :clientId WHERE session_id = :sessionId";
        jdbcClient.sql(sql)
                .param("clientId", clientId)
                .param("sessionId", guestSessionId)
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
