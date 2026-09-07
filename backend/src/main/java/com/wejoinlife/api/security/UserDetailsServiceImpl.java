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

    private record UserRecord(String id, String email, String passwordHash, String role) {}

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        String sql = "SELECT id, email, password_hash, role FROM users WHERE email = :username OR phone = :username";
        return jdbcClient.sql(sql)
                .param("username", username)
                .query(UserRecord.class)
                .optional()
                .map(u -> new User(
                        u.email(),
                        u.passwordHash(),
                        List.of(new SimpleGrantedAuthority("ROLE_" + u.role().toUpperCase()))
                ))
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
}
