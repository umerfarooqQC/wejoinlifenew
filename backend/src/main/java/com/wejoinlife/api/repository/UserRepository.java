package com.wejoinlife.api.repository;

import com.wejoinlife.api.model.User;
import com.wejoinlife.api.model.enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class UserRepository {

    private final JdbcClient jdbcClient;

    public Optional<User> findById(String id) {
        String sql = "SELECT * FROM users WHERE id = :id";
        return jdbcClient.sql(sql)
                .param("id", id)
                .query((rs, rowNum) -> User.builder()
                        .id(rs.getString("id"))
                        .email(rs.getString("email"))
                        .phone(rs.getString("phone"))
                        .passwordHash(rs.getString("password_hash"))
                        .fullName(rs.getString("full_name"))
                        .role(Role.valueOf(rs.getString("role").toUpperCase()))
                        .status(rs.getString("status"))
                        .build())
                .optional();
    }

    public Optional<User> findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = :email";
        return jdbcClient.sql(sql)
                .param("email", email)
                .query((rs, rowNum) -> User.builder()
                        .id(rs.getString("id"))
                        .email(rs.getString("email"))
                        .phone(rs.getString("phone"))
                        .passwordHash(rs.getString("password_hash"))
                        .fullName(rs.getString("full_name"))
                        .role(Role.valueOf(rs.getString("role").toUpperCase()))
                        .status(rs.getString("status"))
                        .build())
                .optional();
    }

    public Optional<User> findByPhone(String phone) {
        String sql = "SELECT * FROM users WHERE phone = :phone";
        return jdbcClient.sql(sql)
                .param("phone", phone)
                .query((rs, rowNum) -> User.builder()
                        .id(rs.getString("id"))
                        .email(rs.getString("email"))
                        .phone(rs.getString("phone"))
                        .passwordHash(rs.getString("password_hash"))
                        .fullName(rs.getString("full_name"))
                        .role(Role.valueOf(rs.getString("role").toUpperCase()))
                        .status(rs.getString("status"))
                        .build())
                .optional();
    }

    public Optional<User> findByUsername(String username) {
        String sql = "SELECT * FROM users WHERE email = :username OR phone = :username";
        return jdbcClient.sql(sql)
                .param("username", username)
                .query((rs, rowNum) -> User.builder()
                        .id(rs.getString("id"))
                        .email(rs.getString("email"))
                        .phone(rs.getString("phone"))
                        .passwordHash(rs.getString("password_hash"))
                        .fullName(rs.getString("full_name"))
                        .role(Role.valueOf(rs.getString("role").toUpperCase()))
                        .status(rs.getString("status"))
                        .build())
                .optional();
    }

    public boolean existsByEmail(String email) {
        Integer count = jdbcClient.sql("SELECT COUNT(1) FROM users WHERE email = :email")
                .param("email", email)
                .query(Integer.class)
                .single();
        return count != null && count > 0;
    }

    public User create(User user) {
        if (user.getId() == null) {
            user.setId(UUID.randomUUID().toString());
        }
        String sql = """
            INSERT INTO users (id, email, phone, password_hash, full_name, role, status)
            VALUES (:id, :email, :phone, :passwordHash, :fullName, :role, :status)
            """;
        jdbcClient.sql(sql)
                .param("id", user.getId())
                .param("email", user.getEmail())
                .param("phone", user.getPhone())
                .param("passwordHash", user.getPasswordHash())
                .param("fullName", user.getFullName())
                .param("role", user.getRole().name())
                .param("status", user.getStatus() != null ? user.getStatus() : "ACTIVE")
                .update();
        return user;
    }

    public void updatePassword(String userId, String passwordHash) {
        String sql = "UPDATE users SET password_hash = :hash WHERE id = :id";
        jdbcClient.sql(sql)
                .param("hash", passwordHash)
                .param("id", userId)
                .update();
    }
}
