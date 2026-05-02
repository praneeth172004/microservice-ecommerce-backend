package com.ecommerce.inventory_service.kafka;

import com.ecommerce.inventory_service.event.OrderEvent;
import com.ecommerce.inventory_service.event.ProductEvent;
import com.ecommerce.inventory_service.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class InventoryConsumer {

    private final InventoryService inventoryService;
    private final InventoryProducer producer;

    @KafkaListener(topics = "product-event", groupId = "inventory-group")
    public void handleProduct(ProductEvent event) {
        inventoryService.addInventory(event.getProductId(), event.getInitialStock());
        log.info("Inventory created for product {}", event.getProductId());
    }

    @KafkaListener(topics = "order-event-topic", groupId = "inventory-group")
    public void handleOrder(OrderEvent event) {

        log.info("Received order event {}", event.getOrderId());

        switch (event.getStatus()) {

            case "CREATED" -> handleCreated(event);

            case "PAYMENT_SUCCESS" -> handlePaymentSuccess(event);

            case "PAYMENT_FAILED" -> handlePaymentFailed(event);

            default -> log.warn("Unknown status {}", event.getStatus());
        }
    }

    private void handleCreated(OrderEvent event) {

        List<OrderEvent.FailedItem> failedItems = new ArrayList<>();
        boolean success = true;

        for (OrderEvent.Item item : event.getItems()) {

            boolean reserved = inventoryService.reserveStock(
                    item.getProductId(),
                    item.getQuantity()
            );

            if (!reserved) {
                success = false;

                int available = inventoryService.getAvailableStock(item.getProductId());

                OrderEvent.FailedItem failed = new OrderEvent.FailedItem();
                failed.setProductId(item.getProductId());
                failed.setRequestedQty(item.getQuantity());
                failed.setAvailableQty(available);
                failed.setReason("INSUFFICIENT_STOCK");

                failedItems.add(failed);
            }
        }

        if (success) {
            event.setStatus("INVENTORY_RESERVED");
        } else {
            event.setStatus("INVENTORY_FAILED");
            event.setFailedItems(failedItems);
        }

        producer.sendInventoryEvent(event);
    }

    private void handlePaymentSuccess(OrderEvent event) {
        event.getItems().forEach(i ->
                inventoryService.confirmStock(i.getProductId(), i.getQuantity()));
    }

    private void handlePaymentFailed(OrderEvent event) {
        event.getItems().forEach(i ->
                inventoryService.releaseStock(i.getProductId(), i.getQuantity()));
    }

}