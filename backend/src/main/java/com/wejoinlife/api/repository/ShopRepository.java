package com.wejoinlife.api.repository;

import com.wejoinlife.api.model.Shop;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ShopRepository {

    private final JdbcClient jdbcClient;

    public Optional<Shop> findById(String id) {
        return jdbcClient.sql("SELECT * FROM shops WHERE id = :id")
                .param("id", id)
                .query(Shop.class)
                .optional();
    }

    public Optional<Shop> findBySlug(String slug) {
        return jdbcClient.sql("SELECT * FROM shops WHERE slug = :slug")
                .param("slug", slug)
                .query(Shop.class)
                .optional();
    }

    public List<Shop> findAllActive() {
        return jdbcClient.sql("SELECT * FROM shops WHERE status = 'ACTIVE' ORDER BY rating DESC")
                .query(Shop.class)
                .list();
    }
}
