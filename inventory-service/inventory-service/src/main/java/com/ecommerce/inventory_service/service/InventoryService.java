package com.ecommerce.inventory_service.service;

import com.ecommerce.inventory_service.Mapper.InventoryMapper;
import com.ecommerce.inventory_service.dto.InventoryResponse;
import com.ecommerce.inventory_service.entity.Inventory;
import com.ecommerce.inventory_service.repository.InventoryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service

public class InventoryService {

    private final InventoryRepository repository;
    private final InventoryMapper mapper;
    public InventoryService(InventoryRepository repository, InventoryMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }
    public void addInventory(UUID productId, Integer quantity) {
        if(repository.existsByProductId(productId)){
            Inventory inventory=repository.findByProductId(productId).orElseThrow(()->new RuntimeException("product not found"));
            inventory.setInitialStock(inventory.getInitialStock()+quantity);
            repository.save(inventory);
            return;
        }
        Inventory inventory = Inventory.builder()
                .productId(productId)
                .initialStock(quantity)
                .reservedStock(0)
                .build();


        repository.save(inventory);
    }

    @Transactional
    public boolean reserveStock(UUID productId, int qty) {

        Inventory inventory = repository.findByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        int available = inventory.getInitialStock() - inventory.getReservedStock();

        if (available < qty) {
            return false;
        }

        inventory.setReservedStock(inventory.getReservedStock() + qty);

        repository.save(inventory);
        return true;
    }

    @Transactional
    public void confirmStock(UUID productId, int qty) {

        Inventory inventory = repository.findByProductId(productId)
                .orElseThrow();

        inventory.setInitialStock(inventory.getInitialStock() - qty);
        inventory.setReservedStock(inventory.getReservedStock() - qty);

        repository.save(inventory);
    }

    @Transactional
    public void releaseStock(UUID productId, int qty) {

        Inventory inventory = repository.findByProductId(productId)
                .orElseThrow();

        inventory.setReservedStock(inventory.getReservedStock() - qty);

        repository.save(inventory);
    }

    public int getAvailableStock(UUID productId) {
        Inventory inventory = repository.findByProductId(productId)
                .orElseThrow();

        return inventory.getInitialStock() - inventory.getReservedStock();
    }
    public InventoryResponse getInventory(UUID productId) {
        Inventory inventory = repository.findByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return mapper.toResponse(inventory);
    }
}