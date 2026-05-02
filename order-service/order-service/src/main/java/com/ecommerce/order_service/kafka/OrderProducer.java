package com.ecommerce.order_service.kafka;

import com.ecommerce.order_service.entity.Order;
import com.ecommerce.order_service.event.OrderCreatedEvent;
import com.ecommerce.order_service.event.OrderEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OrderProducer {
    private final KafkaTemplate<String,Object> kafkaTemplate;
    public void sendOrderCreatedEvent(Order order){
        OrderCreatedEvent orderCreatedEvent = OrderCreatedEvent.builder()
                        .orderId(order.getId())
                                .userId(order.getUserId())
                                        .amount(order.getTotalAmount())
                                                .build();


        kafkaTemplate.send("order-event-payment-topic", order.getId().toString(), orderCreatedEvent);
    }
    public void sendOrderEvent(OrderEvent event){
        kafkaTemplate.send("order-event-inventory-topic",event.getOrderId().toString(),event);
    }
}
