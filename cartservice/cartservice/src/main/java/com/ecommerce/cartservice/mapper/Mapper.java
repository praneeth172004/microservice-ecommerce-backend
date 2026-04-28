package com.ecommerce.cartservice.mapper;

import com.ecommerce.cartservice.dto.*;
import com.ecommerce.cartservice.entity.Cart;
import com.ecommerce.cartservice.entity.CartItem;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Mapper {

    // ✅ Request → Entity
    public static Cart toEntity(UUID userId, CartRequest cartRequest) {
        Cart cart = new Cart();
        cart.setUserId(userId);
        cart.setItems(new ArrayList<>());

        return cart; // items handled in service (important!)
    }

    // ✅ CartItemRequest → CartItem (with product data)
    public static CartItem toCartItem(CartItemRequest request,
                                      Cart cart,
                                      String productName,
                                      BigDecimal price) {

        CartItem item = new CartItem();
        item.setCart(cart);
        item.setProductId(request.getProductId());
        item.setQuantity(request.getQuantity());
        item.setProductName(productName);
        item.setPrice(price);

        return item;
    }

    // ✅ Entity → Response
    public static CartResponse toResponse(Cart cart) {

        List<CartItemResponse> itemResponses = cart.getItems()
                .stream()
                .map(Mapper::toCartItemResponse)
                .toList();

        BigDecimal totalAmount = itemResponses.stream()
                .map(CartItemResponse::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .cartId(cart.getId())
                .userId(cart.getUserId())
                .items(itemResponses)
                .totalAmount(totalAmount)
                .build();
    }

    // ✅ CartItem → CartItemResponse
    public static CartItemResponse toCartItemResponse(CartItem item) {

        BigDecimal totalPrice = item.getPrice()
                .multiply(BigDecimal.valueOf(item.getQuantity()));

        return CartItemResponse.builder()
                .productId(item.getProductId())
                .productName(item.getProductName())
                .price(item.getPrice())
                .quantity(item.getQuantity())
                .totalPrice(totalPrice)
                .build();
    }
}