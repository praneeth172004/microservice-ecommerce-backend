package com.ecommerce.inventory_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class InventoryResponse {
    private UUID id;
    private Integer initialStock;
    private Integer reservedStock;
}
