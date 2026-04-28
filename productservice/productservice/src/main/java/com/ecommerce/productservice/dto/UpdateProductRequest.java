package com.ecommerce.productservice.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProductRequest {



        private String productName;
        private String description;

        private BigDecimal price;

        private String category;

        private Integer stockQuantity;

        private String brand;


}