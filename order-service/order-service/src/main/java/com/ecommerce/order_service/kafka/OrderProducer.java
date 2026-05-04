package com.ecommerce.order_service.kafka;

import com.ecommerce.order_service.entity.Order;
import com.ecommerce.order_service.event.NotificationEvent;
import com.ecommerce.order_service.event.OrderCreatedEvent;
import com.ecommerce.order_service.event.OrderEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

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
    public void sendNotification(OrderEvent event){
        List<NotificationEvent.Item> items = event.getItems().stream()
                .map(i->{
                    NotificationEvent.Item item = new NotificationEvent.Item();
                    item.setProductId(i.getProductId());
                    item.setQuantity(i.getQuantity());
                    return item;
                }).toList();

        NotificationEvent notificationEvent= new NotificationEvent();
                        notificationEvent.setOrderId(event.getOrderId());
                        notificationEvent.setUserId(event.getUserId());
                        notificationEvent.setPrice(event.getPrice());
                        notificationEvent.setStatus(event.getStatus());
                        notificationEvent.setItems(items);
        kafkaTemplate.send("notification-topic", event.getOrderId().toString(), notificationEvent);
    }
}
