package com.ecommerce.order_service.event;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NotificationEvent {
    private UUID orderId;
    private UUID userId;
    private BigDecimal price;
    private List<Item> items;
    private String status;


    @Getter
    @Setter
    public static class Item {
        private UUID productId;
        private Integer quantity;
    }
}
