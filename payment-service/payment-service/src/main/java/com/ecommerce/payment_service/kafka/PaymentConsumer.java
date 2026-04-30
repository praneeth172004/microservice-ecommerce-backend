package com.ecommerce.payment_service.kafka;

import com.ecommerce.payment_service.event.OrderCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentConsumer {

    private final PaymentProducer paymentProducer;

    @KafkaListener(topics = "order-created-topic", groupId = "payment-group")
    public void handleOrderCreated(OrderCreatedEvent event) {

        log.info("Processing payment for order {}", event.getOrderId());

        try {
            boolean success = processPayment(event);

            if (success) {
                paymentProducer.sendSuccess(event.getOrderId());
            } else {
                paymentProducer.sendFailure(event.getOrderId());
            }

        } catch (Exception e) {
            throw new RuntimeException("Retry payment");
        }
    }

    private boolean processPayment(OrderCreatedEvent event) {
        return true; // simulate success
    }
}
