package com.ecommerce.order_service.kafka;

import com.ecommerce.order_service.entity.Order;
import com.ecommerce.order_service.entity.OrderEnum.OrderStatus;
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
    @KafkaListener(topics = "payment-success-topic",groupId = "order-group")
    public void handlePaymentSuccess(PaymentSuccessEvent paymentSuccessEvent) {
        Order order = orderRepository.findById(paymentSuccessEvent.getOrderId()).orElse(null);
        if(order.getStatus()== OrderStatus.PAID){
            return;
        }
        order.setStatus(OrderStatus.PAID);
        orderRepository.save(order);
        log.info("Order {} marked as Paid",paymentSuccessEvent.getOrderId());
    }
    @KafkaListener(topics = "payment-failed-topic",groupId = "order-group")
    public void handlePaymentFailed(PaymentFailedEvent paymentFailedEvent) {
        Order order = orderRepository.findById(paymentFailedEvent.getOrderId()).orElse(null);
        if(order.getStatus()==OrderStatus.CANCELLED){
            return;
        }
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
        log.info("Order {} marked as cancelled",paymentFailedEvent.getOrderId());
    }
}
