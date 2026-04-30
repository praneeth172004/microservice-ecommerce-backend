package com.ecommerce.payment_service.event;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentSuccessEvent {
    private UUID orderId;
}
