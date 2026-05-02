package com.ecommerce.productservice.kafka;

import com.ecommerce.productservice.entity.Product;
import com.ecommerce.productservice.event.ProductEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProductProduce {
    private final KafkaTemplate<String, ProductEvent> kafkaTemplate;
    public void sendProductEvent(Product p) {
        ProductEvent e =ProductEvent.builder()
                .productId(p.getId())
                .initialStock(p.getStockQuantity())
                .build();
        kafkaTemplate.send("product-event",p.getId().toString(),e);
    }
}
