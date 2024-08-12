package com.simple_online_shop.case_study.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class OrderDTO {
    private Integer orderId;
    private String orderCode;
    private LocalDateTime orderDate;
    private BigDecimal totalPrice;
    private Integer quantity;
    private Integer customerId;
    private Integer itemsId;
    private String customerName;
    private String itemName;
}

