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
    private final KafkaTemplate<String,OrderEvent> kafkaTemplate;
    public void sendOrderCreatedEvent(Order order){
        OrderEvent event = OrderEvent.builder()
                .orderId(order.getId())
                .status("CREATED")
                .items(order.getItems().stream().map(item -> {
                    OrderEvent.Item i = new OrderEvent.Item();
                    i.setProductId(item.getProductId());
                    i.setQuantity(item.getQuantity());
                    return i;
                }).toList())
                .build();

        kafkaTemplate.send("order-event-topic", order.getId().toString(), event);
    }
    public void sendOrderEvent(OrderEvent event){
        kafkaTemplate.send("order-event-topic",event.getOrderId().toString(),event);
    }
}
