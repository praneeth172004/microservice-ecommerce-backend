package com.ecommerce.notification_service.feing;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


import java.util.UUID;

@FeignClient(name="product-service")
public interface ProductClient {

        @GetMapping("/api/v1/product/getProductId/{id}")
        ProductResponse getProductId(@PathVariable UUID id);

}
