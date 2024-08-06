package com.simple_online_shop.case_study.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Table(name = "items")
@Entity
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "items_id", nullable = false, updatable = false)
    private Integer itemsId;

    @Column(name = "items_name", nullable = false, length = 100)
    private String itemsName;

    @Column(name = "items_code", nullable = false, length = 20)
    private String itemsCode;

    @Column(name = "stock", nullable = false)
    private Integer stock;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable;

    @Column(name = "last_re_stock")
    private LocalDateTime lastReStock;
}
