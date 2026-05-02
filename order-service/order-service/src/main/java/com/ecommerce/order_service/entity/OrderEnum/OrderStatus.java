package com.ecommerce.order_service.entity.OrderEnum;

public enum OrderStatus {
    CREATED,
    INVENTORY_RESERVED,
    INVENTORY_FAILED,
    PAYMENT_PENDING,
    PAID,
    CANCELLED
}
