package com.ecommerce.cartservice.service;

import com.ecommerce.cartservice.feing.ProductClient;
import com.ecommerce.cartservice.dto.*;
import com.ecommerce.cartservice.entity.Cart;
import com.ecommerce.cartservice.entity.CartItem;
import com.ecommerce.cartservice.mapper.Mapper;
import com.ecommerce.cartservice.repository.CartRepository;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CartService  {

    private final CartRepository cartRepository;
    private final ProductClient productClient;


    public CartResponse addToCart(UUID userId, CartRequest request) {

        // 🔍 Get existing cart or create new
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> Mapper.toEntity(userId, request));

        if (cart.getItems() == null) {
            cart.setItems(new ArrayList<>());
        }

        for (CartItemRequest itemReq : request.getItems()) {

            // 🔥 Call Product Service
            ProductResponse product = productClient.getProductId(itemReq.getProductId());

            // ❗ Validate stock
            if (product.getStockQuantity() < itemReq.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getProductName());
            }

            // 🔍 Check if item already exists
            Optional<CartItem> existingItemOpt = cart.getItems().stream()
                    .filter(i -> i.getProductId().equals(itemReq.getProductId()))
                    .findFirst();

            if (existingItemOpt.isPresent()) {
                // ✅ Update quantity
                CartItem existingItem = existingItemOpt.get();
                existingItem.setQuantity(existingItem.getQuantity() + itemReq.getQuantity());
            } else {
                // ✅ Add new item
                CartItem newItem = Mapper.toCartItem(
                        itemReq,
                        cart,
                        product.getProductName(),
                        product.getPrice()
                );
                cart.getItems().add(newItem);
            }
        }
        cart.setTotalAmount(cart.getItems().stream().map(i->i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity()))).reduce(BigDecimal.ZERO, BigDecimal::add));

        Cart savedCart = cartRepository.save(cart);

        return Mapper.toResponse(savedCart);
    }


    public CartResponse getCart(UUID userId) {

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        return Mapper.toResponse(cart);
    }


    public void clearCart(UUID userId) {

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.getItems().clear();

        cartRepository.save(cart);
    }
}