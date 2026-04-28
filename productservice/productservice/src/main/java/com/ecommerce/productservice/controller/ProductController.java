package com.ecommerce.productservice.controller;

import com.ecommerce.productservice.dto.ProductRequest;
import com.ecommerce.productservice.dto.ProductResponse;
import com.ecommerce.productservice.dto.UpdateProductRequest;
import com.ecommerce.productservice.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/product")
public class ProductController {
    private final ProductService productService;
    @PostMapping("/addProduct")
    public ResponseEntity<ProductResponse> AddProduct(@RequestBody @Valid ProductRequest product){
        ProductResponse response= productService.AddProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/getProductId/{id}")
    public ResponseEntity<ProductResponse> getProductId(@PathVariable UUID id){
        return ResponseEntity.status(HttpStatus.OK).body(productService.getProductById(id));
    }

    @GetMapping("/all")
    public ResponseEntity<List<ProductResponse>> getAllProducts(@RequestParam(defaultValue = "0") int page,
                                                                @RequestParam(defaultValue = "10") int size){
        return ResponseEntity.status(HttpStatus.OK).body(productService.getAllProducts(page, size));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ProductResponse> updateProduct(@RequestBody @Valid UpdateProductRequest product, @PathVariable UUID id){
        return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT).body(productService.UpdateProduct(product,id));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable UUID id){
        productService.deleteProduct(id);
        return ResponseEntity.ok("Product deleted successfully");
    }

}
