package com.simple_online_shop.case_study.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CustomerDTO {
    private Integer customerId;
    private String customerName;
    private String customerAddress;
    private String customerCode;
    private String customerPhone;
    private Boolean isActive;
    private LocalDateTime lastOrderDate;
    private String pic;
}
