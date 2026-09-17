package com.wejoinlife.api.security;

import com.wejoinlife.api.repository.AuthRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
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
    private final AuthRepository authRepository;

    @Value("${application.database.portal-db:vconnect_prod_portal}")
    private String portalDb;

    private record ClientRecord(String id, String clientUuid, String email, String username, String pass, String isSuperUser) {}

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        String clientSql = "SELECT id, client_uuid AS clientUuid, email, username, pass, is_super_user AS isSuperUser " +
                           "FROM " + portalDb + ".clients " +
                           "WHERE is_active = 1 AND (email = :username OR username = :username) LIMIT 1";
        ClientRecord c = jdbcClient.sql(clientSql)
                .param("username", username)
                .query(ClientRecord.class)
                .optional()
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        boolean isSeller = authRepository.isSeller(c.clientUuid());
        String role = isSeller ? "seller" : "buyer";
        String effectiveUsername = (c.email() != null && !c.email().isBlank()) ? c.email() : c.username();
        return new User(effectiveUsername, c.pass(), List.of(new SimpleGrantedAuthority(role)));
    }
}
