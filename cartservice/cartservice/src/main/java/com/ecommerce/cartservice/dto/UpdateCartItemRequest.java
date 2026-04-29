package com.ecommerce.cartservice.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class UpdateCartItemRequest {
    private UUID productId;
    private Integer quantity;
}
