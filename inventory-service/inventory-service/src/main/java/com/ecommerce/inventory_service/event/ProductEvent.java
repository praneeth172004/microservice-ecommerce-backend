package com.ecommerce.inventory_service.event;



import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductEvent {
    private UUID productId;
    private Integer initialStock;
}
