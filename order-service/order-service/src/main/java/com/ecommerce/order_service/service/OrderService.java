package com.ecommerce.order_service.service;

import com.ecommerce.order_service.dto.CartItemResponse;
import com.ecommerce.order_service.dto.CartResponse;
import com.ecommerce.order_service.dto.OrderRequest;
import com.ecommerce.order_service.dto.OrderResponse;
import com.ecommerce.order_service.entity.Order;
import com.ecommerce.order_service.entity.OrderEnum.OrderStatus;
import com.ecommerce.order_service.entity.OrderItem;
import com.ecommerce.order_service.feing.CartClient;
import com.ecommerce.order_service.kafka.OrderProducer;
import com.ecommerce.order_service.mapper.OrderMapper;
import com.ecommerce.order_service.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
@Service
@RequiredArgsConstructor
public class OrderService {
    private final CartClient cartClient;
    private final OrderRepository orderRepository;
    private final OrderProducer orderProducer;

    public OrderResponse createOrder(OrderRequest request) {
        CartResponse cart= cartClient.getCart(request.getUserId());
        if(cart.getItems().isEmpty()){
            throw new RuntimeException("Cart is empty");
        }
        List<OrderItem> items=new ArrayList<>();
        BigDecimal total=BigDecimal.ZERO;
        for(CartItemResponse item:cart.getItems()){
            BigDecimal itemTotal=item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            total=total.add(itemTotal);
            items.add(OrderItem.builder()
                    .productId(item.getProductId())
                    .productName(item.getProductName())
                    .price(item.getPrice())
                    .quantity(item.getQuantity())
                    .build()
            );
        }
        Order order = Order.builder()
                .userId(request.getUserId())
                .items(items)
                .status(OrderStatus.PAYMENT_PENDING)
                .totalAmount(total)
                .build();
        items.forEach(i -> i.setOrder(order));
        orderRepository.save(order);
        orderProducer.sendOrderCreatedEvent(order);
        Order savedOrder=orderRepository.save(order);


        return OrderMapper.toResponse(savedOrder);

    }

    public OrderResponse getOrderById(UUID orderId) {
        Order order=orderRepository.findById(orderId)
                .orElseThrow(()-> new RuntimeException("Order not found"));
        return OrderMapper.toResponse(order);
    }

    public List<OrderResponse> getOrdersByUser(UUID userId) {
        List<Order>  order= Collections.singletonList(orderRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Orders not found")));
        return order.stream().map(OrderMapper::toResponse).toList();
    }

    public void cancelOrder(UUID orderId) {
        if(orderRepository.existsById(orderId)){
            orderRepository.deleteById(orderId);
        }else{
            throw new RuntimeException("Order not found");
        }
    }
}
