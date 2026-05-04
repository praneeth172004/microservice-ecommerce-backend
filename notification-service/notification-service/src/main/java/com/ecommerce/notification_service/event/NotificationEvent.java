package com.ecommerce.notification_service.event;

import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationEvent {
    private UUID orderId;
    private UUID userId;
    private BigDecimal price;
    private List<Item> items;
    private String status;
    private Instant createdAt;

    @Getter
    @Setter
    public static class Item {
        private UUID productId;
        private Integer quantity;
    }
}
