package com.ecommerce.cartservice.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartRequest {

    @Valid
    @NotEmpty(message = "Cart items cannot be empty")
    private List<CartItemRequest> items;
}