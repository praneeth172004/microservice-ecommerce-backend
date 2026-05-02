package com.ecommerce.inventory_service.Mapper;

import com.ecommerce.inventory_service.dto.InventoryResponse;
import com.ecommerce.inventory_service.entity.Inventory;
import org.springframework.stereotype.Component;

@Component
public class InventoryMapper {
    public InventoryResponse toResponse(Inventory inventory){
        InventoryResponse inventoryResponse = InventoryResponse.builder()
                .id(inventory.getId())
                .initialStock(inventory.getInitialStock())
                .reservedStock(inventory.getReservedStock())
                .build();
        return inventoryResponse;
    }

}
