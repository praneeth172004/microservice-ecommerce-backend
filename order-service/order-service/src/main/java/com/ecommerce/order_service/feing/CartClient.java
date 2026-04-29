package com.ecommerce.order_service.feing;

import com.ecommerce.order_service.dto.CartResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "cart-service")
public interface CartClient {
    @GetMapping("/api/v1/cart/item/{userId}")
    CartResponse getCart(@PathVariable UUID userId);
}
