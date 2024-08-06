package com.simple_online_shop.case_study.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ItemDTO {
    private Integer itemsId;
    private String itemsName;
    private String itemsCode;
    private Integer stock;
    private BigDecimal price;
    private Boolean isAvailable;
    private LocalDateTime lastReStock;
}
