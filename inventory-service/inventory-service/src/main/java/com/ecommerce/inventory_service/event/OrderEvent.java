package com.ecommerce.inventory_service.event;


import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderEvent {

    private UUID orderId;
    private List<Item> items;
    private String status;

    private List<FailedItem> failedItems;

    @Getter
    @Setter
    public static class Item {
        private UUID productId;
        private Integer quantity;
    }

    @Getter
    @Setter
    public static class FailedItem {
        private UUID productId;
        private Integer requestedQty;
        private Integer availableQty;
        private String reason;
    }
}
