package com.wejoinlife.api.service;

import com.wejoinlife.api.dto.product.ProductResponse;
import com.wejoinlife.api.model.Product;
import com.wejoinlife.api.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductResponse> getPublishedProducts(int page, int size) {
        int offset = page * size;
        return productRepository.findPublished(size, offset).stream()
                .map(this::toResponse)
                .toList();
    }

    public ProductResponse getProductById(String id) {
        return productRepository.findById(id)
                .map(this::toResponse)
                .orElse(null);
    }

    private ProductResponse toResponse(Product p) {
        return new ProductResponse(
                p.getId(),
                p.getShopId(),
                p.getShopName(),
                p.getName(),
                p.getSlug(),
                p.getPrice(),
                p.getStockQuantity() != null ? p.getStockQuantity() : 0,
                p.getImageUrl(),
                p.getStatus()
        );
    }
}
