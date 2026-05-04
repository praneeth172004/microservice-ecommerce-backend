package com.ecommerce.notification_service.kafka;

import com.ecommerce.notification_service.event.NotificationEvent;
import com.ecommerce.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class NotificationConsume{
    private final NotificationService notificationService;

    @KafkaListener(topics = "notification-topic",groupId = "notification-group")
    public void consumePaymentSuccessNotification(NotificationEvent event){
        log.info("Received Notification Event : {}", event);
        switch (event.getStatus()) {

            case "PAYMENT_SUCCESS" -> notificationService.handleSuccess(event);

            case "PAYMENT_FAILED" -> notificationService.handleFailure(event);

            default -> log.warn("Unknown event type: {}", event.getStatus());
        }

    }
}
