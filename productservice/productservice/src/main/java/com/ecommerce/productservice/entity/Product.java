package com.ecommerce.productservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;


@Entity
@Table(name="product",
        indexes = {
                @Index(name = "idx_product_category",columnList = "category"),
                @Index(name = "idx_product_price",columnList = "price"),
                @Index(name = "idx_product_name",columnList = "productName")
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    @Size(min=3,max=50,message="Product name must be Between 3 and 5")
    @NotBlank(message = "Product name is Required")
    private String productName;

    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be greater than zero")
    private BigDecimal price;

    @Size(max = 100, message = "Category cannot exceed 100 characters")
    @Column(length = 100)
    private String category;

    @Column(name = "stock_quantity", nullable = false)
    @Min(value = 0, message = "Stock quantity cannot be negative")
    private Integer stockQuantity = 0;

    @CreationTimestamp
    @Column(name="created_at",updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name="update_at")
    private LocalDateTime updatedAt;

    @Column(length = 100)
    private String brand;


}
