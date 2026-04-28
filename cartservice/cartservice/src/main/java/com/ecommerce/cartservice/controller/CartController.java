package com.ecommerce.cartservice.controller;

import com.ecommerce.cartservice.dto.CartRequest;
import com.ecommerce.cartservice.dto.CartResponse;
import com.ecommerce.cartservice.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    // ✅ Add items to cart
    @PostMapping("/{userId}")
    public ResponseEntity<CartResponse> addToCart(
            @PathVariable UUID userId,
            @Valid @RequestBody CartRequest request) {

        CartResponse response = cartService.addToCart(userId, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}
