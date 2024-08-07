package com.simple_online_shop.case_study.controller;

import com.simple_online_shop.case_study.dto.CommonResponseDTO;
import com.simple_online_shop.case_study.dto.OrderDTO;
import com.simple_online_shop.case_study.exception.ResourceNotFoundException;
import com.simple_online_shop.case_study.exception.StockNotAvailableException;
import com.simple_online_shop.case_study.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private final OrderService orderService;

    public OrderController (OrderService orderService){
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<CommonResponseDTO<OrderDTO>> createOrder(
            @RequestParam("customerId") Integer customerId,
            @RequestParam("itemsId") Integer itemsId,
            @RequestParam("quantity") Integer quantity) {
        try {
            OrderDTO orderDTO = orderService.createOrder(customerId, itemsId, quantity);
            CommonResponseDTO<OrderDTO> response = new CommonResponseDTO<>("Order created successfully", orderDTO);
            return ResponseEntity.ok(response);
        } catch (StockNotAvailableException e) {
            CommonResponseDTO<OrderDTO> response = new CommonResponseDTO<>(e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (ResourceNotFoundException e) {
            CommonResponseDTO<OrderDTO> response = new CommonResponseDTO<>(e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            CommonResponseDTO<OrderDTO> response = new CommonResponseDTO<>("An error occurred while creating the order.", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderById(
            @PathVariable Integer orderId) {
        try {
            OrderDTO orderDTO = orderService.getOrderById(orderId);
            CommonResponseDTO<OrderDTO> response = new CommonResponseDTO<>("Order fetched successfully", orderDTO);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            CommonResponseDTO<OrderDTO> response = new CommonResponseDTO<>(e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            CommonResponseDTO<OrderDTO> response = new CommonResponseDTO<>("An error occurred while fetching the order.", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("customer/{customerId}")
    public ResponseEntity<CommonResponseDTO<List<OrderDTO>>> getAllOrdersByCustomerId(
            @PathVariable Integer customerId) {
        try {
            List<OrderDTO> orders = orderService.getAllOrdersByCustomerId(customerId);
            CommonResponseDTO<List<OrderDTO>> response = new CommonResponseDTO<>("Orders fetched successfully", orders);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            CommonResponseDTO<List<OrderDTO>> response = new CommonResponseDTO<>(e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            CommonResponseDTO<List<OrderDTO>> response = new CommonResponseDTO<>("An error occurred while fetching orders.", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PutMapping("/{orderId}")
    public ResponseEntity<CommonResponseDTO<OrderDTO>> updateOrder(
            @PathVariable Integer orderId,
            @RequestParam Integer quantity) {
        try {
            OrderDTO orderDTO = orderService.updateOrder(orderId, quantity);
            CommonResponseDTO<OrderDTO> response = new CommonResponseDTO<>("Order updated successfully", orderDTO);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            CommonResponseDTO<OrderDTO> response = new CommonResponseDTO<>(e.getMessage(), null);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            CommonResponseDTO<OrderDTO> response = new CommonResponseDTO<>("An error occurred while updating the order.", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<String> deleteOrder(
            @PathVariable Integer orderId) {
        try {
            orderService.deleteOrder(orderId);
            return ResponseEntity.ok("Order deleted successfully.");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the item.");
        }
    }
}
