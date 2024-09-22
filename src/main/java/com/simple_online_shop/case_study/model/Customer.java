package com.simple_online_shop.case_study.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Table(name = "customers")
@Entity
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id", nullable = false, updatable = false)
    private Integer customerId;

    @Column(name = "customer_name", nullable = false, length = 100)
    private String customerName;

    @Column(name = "customer_address", nullable = false, length = 200)
    private String customerAddress;

    @Column(name = "customer_code", nullable = false, length = 20)
    private String customerCode;

    @Column(name = "customer_phone", nullable = false, length = 20)
    private String customerPhone;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "last_order_date")
    private LocalDateTime lastOrderDate;

    @Column(name = "pic", length = 100)
    private String pic;

    @Column(name = "url_pic", length = 1000)
    private String urlPic;
}
