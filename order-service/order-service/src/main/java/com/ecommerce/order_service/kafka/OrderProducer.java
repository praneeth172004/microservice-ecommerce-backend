package com.ecommerce.order_service.kafka;

import com.ecommerce.order_service.entity.Order;
import com.ecommerce.order_service.event.OrderCreatedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OrderProducer {
    private final KafkaTemplate<String,OrderCreatedEvent> kafkaTemplate;
    public void sendOrderCreatedEvent(Order order){
        OrderCreatedEvent orderCreatedEvent=OrderCreatedEvent.builder()
                .orderId(order.getId())
                .userId(order.getUserId())
                .amount(order.getTotalAmount())
                .build();
        kafkaTemplate.send("order-created-topic",order.getId().toString(),orderCreatedEvent);
    }

}
