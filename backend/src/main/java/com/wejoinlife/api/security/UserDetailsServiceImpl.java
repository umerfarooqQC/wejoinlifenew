package com.wejoinlife.api.security;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final JdbcClient jdbcClient;

    @org.springframework.beans.factory.annotation.Value("${application.database.portal-db:vconnect_prod_portal}")
    private String portalDb;

    private record ClientRecord(String id, String email, String pass, String isSuperUser) {}

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        String clientSql = "SELECT id, email, pass, is_super_user AS isSuperUser FROM " + portalDb + ".clients WHERE site_id = 0 AND email = :username";
        ClientRecord c = jdbcClient.sql(clientSql)
                .param("username", username)
                .query(ClientRecord.class)
                .optional()
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        String role = "1".equals(c.isSuperUser()) ? "ROLE_ADMIN" : "ROLE_BUYER";
        return new User(c.email(), c.pass(), List.of(new SimpleGrantedAuthority(role)));
    }
}
