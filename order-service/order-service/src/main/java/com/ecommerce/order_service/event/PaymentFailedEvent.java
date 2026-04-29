package com.ecommerce.order_service.event;

import lombok.*;

import java.util.UUID;

@Getter
@Setter @Builder
public class PaymentFailedEvent {
    private UUID orderId;
}
