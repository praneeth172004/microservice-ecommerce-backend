package com.ecommerce.payment_service.kafka;

import com.ecommerce.payment_service.event.PaymentFailedEvent;
import com.ecommerce.payment_service.event.PaymentSuccessEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class PaymentProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendSuccess(UUID orderId) {
        kafkaTemplate.send(
                "payment-success-topic",
                orderId.toString(),
                new PaymentSuccessEvent(orderId)
        );
    }

    public void sendFailure(UUID orderId) {
        kafkaTemplate.send(
                "payment-failed-topic",
                orderId.toString(),
                new PaymentFailedEvent(orderId)
        );
    }
}
