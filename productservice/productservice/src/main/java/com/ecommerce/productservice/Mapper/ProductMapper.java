package com.ecommerce.productservice.Mapper;

import com.ecommerce.productservice.dto.ProductRequest;
import com.ecommerce.productservice.dto.ProductResponse;
import com.ecommerce.productservice.entity.Product;

public class ProductMapper {
    public static Product toEntity(ProductRequest request) {
        Product p = new Product();
        p.setProductName(request.getProductName());
        p.setDescription(request.getDescription());
        p.setPrice(request.getPrice());
        p.setCategory(request.getCategory());
        p.setStockQuantity(request.getStockQuantity());
        p.setBrand(request.getBrand());
        return p;
    }
    public static ProductResponse toResponse(Product p) {
        return ProductResponse.builder()
                .id(p.getId())
                .productName(p.getProductName())
                .category(p.getCategory())
                .brand(p.getBrand())
                .price(p.getPrice())
                .stockQuantity(p.getStockQuantity())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
