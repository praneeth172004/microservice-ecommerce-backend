package com.ecommerce.order_service.mapper;

import com.ecommerce.order_service.dto.OrderItemResponse;
import com.ecommerce.order_service.dto.OrderResponse;
import com.ecommerce.order_service.entity.Order;
import com.ecommerce.order_service.entity.OrderItem;

import java.util.List;

public class OrderMapper {
    public static OrderResponse toResponse(Order order) {
        return OrderResponse.builder()
                .orderId(order.getId())
                .userId(order.getUserId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .items(mapItems(order.getItems()))
                .build();
    }

    private static List<OrderItemResponse> mapItems(List<OrderItem> items) {
        return items.stream().map(item ->
                OrderItemResponse.builder()
                        .productId(item.getProductId())
                        .productName(item.getProductName())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .build()
        ).toList();
    }

}
