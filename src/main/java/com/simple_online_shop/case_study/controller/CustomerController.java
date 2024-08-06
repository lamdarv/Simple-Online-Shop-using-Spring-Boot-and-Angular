package com.simple_online_shop.case_study.controller;

import com.simple_online_shop.case_study.dto.CustomerDTO;
import com.simple_online_shop.case_study.exception.CustomerDeletionException;
import com.simple_online_shop.case_study.exception.ResourceNotFoundException;
import com.simple_online_shop.case_study.service.CustomerService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    @Autowired
    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping("/create")
    public ResponseEntity<CustomerDTO> createCustomer(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("customerName") String customerName,
            @RequestParam("customerAddress") String customerAddress,
            @RequestParam("customerCode") String customerCode,
            @RequestParam("customerPhone") String customerPhone,
            @RequestParam("isActive") Boolean isActive,
            @RequestParam(value = "lastOrderDate", required = false) String lastOrderDate) {

        CustomerDTO response = customerService.createCustomer(file, customerName, customerAddress, customerCode, customerPhone, isActive, lastOrderDate);
        return ResponseEntity.ok(response);
    }

//    private CustomerDTO createCustomerDTO(String customerName, String customerAddress, String customerCode, String customerPhone, Boolean isActive, String lastOrderDate) {
//        CustomerDTO customerDTO = new CustomerDTO();
//        customerDTO.setCustomerName(customerName);
//        customerDTO.setCustomerAddress(customerAddress);
//        customerDTO.setCustomerCode(customerCode);
//        customerDTO.setCustomerPhone(customerPhone);
//        customerDTO.setIsActive(isActive);
//        if (lastOrderDate != null) {
//            customerDTO.setLastOrderDate(LocalDateTime.parse(lastOrderDate));
//        }
//        return customerDTO;
//    }

    @PutMapping("/{customerId}")
    public ResponseEntity<CustomerDTO> updateCustomer(
            @PathVariable Integer customerId,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "customerName", required = false) String customerName,
            @RequestParam(value = "customerAddress", required = false) String customerAddress,
            @RequestParam(value = "customerCode", required = false) String customerCode,
            @RequestParam(value = "customerPhone", required = false) String customerPhone,
            @RequestParam(value = "isActive", required = false) Boolean isActive,
            @RequestParam(value = "lastOrderDate", required = false) String lastOrderDate) {

        CustomerDTO response = customerService.updateCustomer(customerId, file, customerName, customerAddress, customerCode, customerPhone, isActive, lastOrderDate);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<CustomerDTO>> getAllCustomers() {
        List<CustomerDTO> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<CustomerDTO> getCustomerById(@PathVariable Integer customerId) {
        CustomerDTO customerDTO = customerService.getCustomerById(customerId);
        return ResponseEntity.ok(customerDTO);
    }

    @DeleteMapping("/{customerId}")
    public ResponseEntity<String> deleteCustomer(@PathVariable Integer customerId) {
        try {
            customerService.deleteCustomer(customerId);
            return ResponseEntity.ok("Customer with id " + customerId + " has been successfully deleted.");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (CustomerDeletionException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
