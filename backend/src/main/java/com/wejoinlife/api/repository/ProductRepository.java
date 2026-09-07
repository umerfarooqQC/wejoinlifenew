package com.wejoinlife.api.repository;

import com.wejoinlife.api.model.Product;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ProductRepository {

    private final JdbcClient jdbcClient;

    public Optional<Product> findById(String id) {
        String sql = """
            SELECT p.*, s.shop_name 
            FROM products p 
            JOIN shops s ON p.shop_id = s.id 
            WHERE p.id = :id
            """;
        return jdbcClient.sql(sql)
                .param("id", id)
                .query(Product.class)
                .optional();
    }

    public List<Product> findPublished(int limit, int offset) {
        String sql = """
            SELECT p.*, s.shop_name 
            FROM products p 
            JOIN shops s ON p.shop_id = s.id 
            WHERE p.status = 'PUBLISHED'
            ORDER BY p.created_at DESC 
            LIMIT :limit OFFSET :offset
            """;
        return jdbcClient.sql(sql)
                .param("limit", limit)
                .param("offset", offset)
                .query(Product.class)
                .list();
    }

    public List<Product> findByShopId(String shopId) {
        String sql = "SELECT * FROM products WHERE shop_id = :shopId ORDER BY created_at DESC";
        return jdbcClient.sql(sql)
                .param("shopId", shopId)
                .query(Product.class)
                .list();
    }
}
