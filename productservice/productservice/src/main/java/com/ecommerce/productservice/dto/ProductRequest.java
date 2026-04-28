package com.ecommerce.productservice.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductRequest {
    @NotBlank
    private String productName;
    private String description;
    @NotNull
    @Positive
    private BigDecimal price;
    @NotBlank
    private String category;
    @NotNull
    @Min(0)
    private Integer stockQuantity;
    @NotBlank
    private String brand;
}
