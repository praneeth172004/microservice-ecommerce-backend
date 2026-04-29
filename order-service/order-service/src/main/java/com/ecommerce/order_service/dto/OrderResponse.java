package com.ecommerce.order_service.dto;

import com.ecommerce.order_service.entity.OrderEnum.OrderStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    private UUID orderId;
    private UUID userId;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private LocalDateTime createdAt;

    private List<OrderItemResponse> items;
}
