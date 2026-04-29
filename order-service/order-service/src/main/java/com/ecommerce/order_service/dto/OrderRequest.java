package com.ecommerce.order_service.dto;

import lombok.*;

import java.util.List;
import java.util.UUID;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequest {

    private UUID userId;

    private List<OrderItemRequest> items;
}
