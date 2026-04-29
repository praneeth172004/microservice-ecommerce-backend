package com.ecommerce.order_service.event;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@Builder
public class OrderCreatedEvent {
    private UUID orderId;
    private UUID userId;
    private BigDecimal amount;
}
