package com.ecommerce.order_service.kafka;

import com.ecommerce.order_service.entity.Order;
import com.ecommerce.order_service.entity.OrderEnum.OrderStatus;
import com.ecommerce.order_service.event.OrderEvent;
import com.ecommerce.order_service.event.PaymentFailedEvent;
import com.ecommerce.order_service.event.PaymentSuccessEvent;
import com.ecommerce.order_service.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderConsumer {

    private final OrderRepository orderRepository;
    private final OrderProducer orderProducer;

    @KafkaListener(topics = "inventory_events", groupId = "order-group") // ✅ FIXED
    public void handleInventory(OrderEvent event) {

        Order order = orderRepository.findById(event.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if ("INVENTORY_FAILED".equals(event.getStatus())) {

            order.setStatus(OrderStatus.CANCELLED);
            orderRepository.save(order);

            event.getFailedItems().forEach(item ->
                    log.error("Product {} insufficient. Requested={}, Available={}",
                            item.getProductId(),
                            item.getRequestedQty(),
                            item.getAvailableQty()));
        }

        else if ("INVENTORY_RESERVED".equals(event.getStatus())) {

            order.setStatus(OrderStatus.PAYMENT_PENDING);
            orderRepository.save(order);

//            orderProducer.sendOrderCreatedEvent(order);
        }
    }
}