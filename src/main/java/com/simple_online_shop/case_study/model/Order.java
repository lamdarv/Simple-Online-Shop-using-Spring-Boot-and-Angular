package com.simple_online_shop.case_study.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Table(name = "orders")
@Entity
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id", nullable = false, updatable = false)
    private Integer orderId;

    @Column(name = "order_code", nullable = false, length = 20)
    private String orderCode;

    @Column(name = "order_date")
    private LocalDateTime orderDate;

    @Column(name = "total_price", nullable = false)
    private BigDecimal totalPrice;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "items_id", nullable = false)
    private Item item;

    public Integer getCustomerId() {
        return this.customer != null ? this.customer.getCustomerId() : null;
    }

    public String getCustomerName() {
        return this.customer != null ? this.customer.getCustomerName() : null;
    }

    public Integer getItemId() {
        return this.item != null ? this.item.getItemsId() : null;
    }

    public String getItemName() {
        return this.item != null ? this.item.getItemsName() : null;
    }

}

