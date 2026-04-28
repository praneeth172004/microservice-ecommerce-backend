package com.ecommerce.productservice.service;

import com.ecommerce.productservice.Mapper.ProductMapper;
import com.ecommerce.productservice.dto.ProductRequest;
import com.ecommerce.productservice.dto.ProductResponse;
import com.ecommerce.productservice.dto.UpdateProductRequest;
import com.ecommerce.productservice.entity.Product;
import com.ecommerce.productservice.repository.ProductRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    @Transactional
    public ProductResponse AddProduct(ProductRequest product) {
        Product p= ProductMapper.toEntity(product);
        Product product1=productRepository.save(p);
        return ProductMapper.toResponse(product1);
    }

    public ProductResponse getProductById(UUID id) {
        Product p=productRepository.findById(id).orElseThrow(
                ()-> new RuntimeException("Product not found"+id)
        );
        return ProductMapper.toResponse(p);
    }

    public List<ProductResponse> getAllProducts(int page,int size) {
        Pageable pageable= PageRequest.of(page, size);
        return productRepository.findAll().stream().map(ProductMapper::toResponse).toList();
    }
    @Transactional
    public ProductResponse UpdateProduct(@Valid UpdateProductRequest product, UUID id) {
       Product p=productRepository.findById(id).orElseThrow(
               ()-> new RuntimeException("Product not found"+id)
       );
       if(product.getProductName()!=null){
            p.setProductName(product.getProductName());
       }else if(product.getCategory()!=null){
           p.setCategory(product.getCategory());
       }else if(product.getBrand()!=null){
           p.setBrand(product.getBrand());
       }else if(product.getPrice()!=null){
           p.setPrice(product.getPrice());
       }else if(product.getStockQuantity()!=null){
           p.setStockQuantity(product.getStockQuantity());
       }
       return ProductMapper.toResponse(p);
    }

    public void deleteProduct(UUID id) {
        if(!productRepository.existsById(id)){
            throw new RuntimeException("Product not found" + id);
        }else{
            productRepository.deleteById(id);
        }
    }


}
