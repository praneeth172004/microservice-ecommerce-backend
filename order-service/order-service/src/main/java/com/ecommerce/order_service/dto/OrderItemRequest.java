package com.ecommerce.order_service.dto;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemRequest {
    private UUID productId;
    private Integer quantity;
}
