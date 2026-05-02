package com.ecommerce.inventory_service.kafka;

import com.ecommerce.inventory_service.event.OrderEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InventoryProducer {
    private final KafkaTemplate<String, OrderEvent> kafkaTemplate; // ✅ strong type

    public void sendInventoryEvent(OrderEvent event) {
        kafkaTemplate.send(
                "inventory_events",
                event.getOrderId().toString(),
                event
        );
    }
}
