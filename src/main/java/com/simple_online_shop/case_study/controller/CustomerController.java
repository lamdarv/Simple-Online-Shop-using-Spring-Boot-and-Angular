package com.simple_online_shop.case_study.controller;

import com.simple_online_shop.case_study.dto.CommonResponseDTO;
import com.simple_online_shop.case_study.dto.CustomerDTO;
import com.simple_online_shop.case_study.exception.CustomerDeletionException;
import com.simple_online_shop.case_study.exception.ResourceNotFoundException;
import com.simple_online_shop.case_study.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    public ResponseEntity<CommonResponseDTO<CustomerDTO>> createCustomer(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("customerName") String customerName,
            @RequestParam("customerAddress") String customerAddress,
            @RequestParam("customerCode") String customerCode,
            @RequestParam("customerPhone") String customerPhone,
            @RequestParam("isActive") Boolean isActive,
            @RequestParam(value = "lastOrderDate", required = false) String lastOrderDate) {

        try {
            CustomerDTO customerDTO = customerService.createCustomer(file, customerName,
                    customerAddress, customerCode, customerPhone, isActive, lastOrderDate);
            CommonResponseDTO<CustomerDTO> response = new CommonResponseDTO<>("Item created successfully", customerDTO);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            CommonResponseDTO<CustomerDTO> response = new CommonResponseDTO<>(e.getMessage(), null);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            CommonResponseDTO<CustomerDTO> response = new CommonResponseDTO<>("An error occurred while creating the customer.", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

    }

    @PutMapping("/{customerId}")
    public ResponseEntity<CommonResponseDTO<CustomerDTO>> updateCustomer(
            @PathVariable Integer customerId,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "customerName", required = false) String customerName,
            @RequestParam(value = "customerAddress", required = false) String customerAddress,
            @RequestParam(value = "customerCode", required = false) String customerCode,
            @RequestParam(value = "customerPhone", required = false) String customerPhone,
            @RequestParam(value = "isActive", required = false) Boolean isActive,
            @RequestParam(value = "lastOrderDate", required = false) String lastOrderDate) {

        try {
            CustomerDTO customerDTO = customerService.updateCustomer(customerId, file, customerName,
                    customerAddress, customerCode, customerPhone, isActive, lastOrderDate);
            CommonResponseDTO<CustomerDTO> response = new CommonResponseDTO<>("Item updating successfully", customerDTO);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            CommonResponseDTO<CustomerDTO> response = new CommonResponseDTO<>(e.getMessage(), null);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            CommonResponseDTO<CustomerDTO> response = new CommonResponseDTO<>("An error occurred while creating the customer.", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping
    public ResponseEntity<CommonResponseDTO<List<CustomerDTO>>> getAllCustomers() {
        try {
            List<CustomerDTO> customerDTOList = customerService.getAllCustomers();
            CommonResponseDTO<List<CustomerDTO>> response = new CommonResponseDTO<>("Customers fetched successfully", customerDTOList);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            CommonResponseDTO<List<CustomerDTO>> response = new CommonResponseDTO<>(e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            CommonResponseDTO<List<CustomerDTO>> response = new CommonResponseDTO<>("An error occurred while fetching customers.", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

    }

    @GetMapping("/{customerId}")
    public ResponseEntity<CommonResponseDTO<CustomerDTO>> getCustomerById(@PathVariable Integer customerId) {
        try {
            CustomerDTO customerDTO = customerService.getCustomerById(customerId);
            CommonResponseDTO<CustomerDTO> response = new CommonResponseDTO<>("Customer fetched successfully", customerDTO);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            CommonResponseDTO<CustomerDTO> response = new CommonResponseDTO<>(e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            CommonResponseDTO<CustomerDTO> response = new CommonResponseDTO<>("An error occurred while fetching the customer.", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
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
