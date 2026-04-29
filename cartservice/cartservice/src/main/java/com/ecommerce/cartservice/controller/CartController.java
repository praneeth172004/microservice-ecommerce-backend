package com.ecommerce.cartservice.controller;

import com.ecommerce.cartservice.dto.CartRequest;
import com.ecommerce.cartservice.dto.CartResponse;
import com.ecommerce.cartservice.dto.UpdateCartItemRequest;
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
    @PostMapping("/addCart/{userId}")
    public ResponseEntity<CartResponse> addToCart(
            @PathVariable UUID userId,
            @Valid @RequestBody CartRequest request) {

        CartResponse response = cartService.addToCart(userId, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/item/{userId}")
    public ResponseEntity<CartResponse> getCart(@PathVariable UUID userId) {
        CartResponse response = cartService.getCart(userId);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PutMapping("/itemupdate/{userId}")
    public ResponseEntity<CartResponse> updateCart(@PathVariable UUID userId, @Valid @RequestBody UpdateCartItemRequest request) {
        CartResponse response = cartService.updateCart(userId, request);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<String>  deleteCart(@PathVariable UUID userId) {
        cartService.clearCart(userId);
        return ResponseEntity.status(200).body("Deleted Successfully");
    }

    @DeleteMapping("/{userId}/item/{productId}")
    public ResponseEntity<String>  deleteCartItem(@PathVariable UUID userId, @PathVariable UUID productId) {
        cartService.removeItem(userId, productId);
        return ResponseEntity.status(200).body("Item Deleted Successfully");
    }
}
