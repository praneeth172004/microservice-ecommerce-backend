package com.ecommerce.inventory_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name="inventory")
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(nullable = false,unique = true)
    private UUID productId;
    @Column(nullable=false)
    private Integer initialStock;
    @Column(nullable = false)
    private Integer reservedStock;
}
