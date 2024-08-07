package com.simple_online_shop.case_study.service;

import com.simple_online_shop.case_study.dto.OrderDTO;
import com.simple_online_shop.case_study.exception.ResourceNotFoundException;
import com.simple_online_shop.case_study.exception.StockNotAvailableException;
import com.simple_online_shop.case_study.model.Customer;
import com.simple_online_shop.case_study.model.Item;
import com.simple_online_shop.case_study.model.Order;
import com.simple_online_shop.case_study.repository.CustomerRepository;
import com.simple_online_shop.case_study.repository.ItemRepository;
import com.simple_online_shop.case_study.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class OrderService {
    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final ItemRepository itemRepository;
    private final ModelMapper modelMapper;

    @Transactional
    public OrderDTO createOrder(Integer customerId, Integer itemsId, Integer quantity){
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));
        Item item = itemRepository.findById(itemsId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + itemsId));
        if (item.getStock() < quantity) {
            throw new StockNotAvailableException("Stock items with ID " + itemsId + " only have " + item.getStock() + " remaining");
        }
        if (!item.getIsAvailable()) {
            throw new StockNotAvailableException("Stock items with ID " + itemsId + " is not available");
        }

        Order order = new Order();
        order.setCustomer(customer);
        order.setItem(item);
        order.setQuantity(quantity);
        order.setTotalPrice(item.getPrice().multiply(BigDecimal.valueOf(quantity)));
        order.setOrderDate(LocalDateTime.now());
        order.setOrderCode(generateOrderCode());

        // Update item stock and availability
        int updatedStock = item.getStock() - quantity;
        item.setStock(updatedStock);
        if (updatedStock == 0) {
            item.setIsAvailable(false);
        }
        itemRepository.save(item);

        Order savedOrder = orderRepository.save(order);
        return modelMapper.map(savedOrder, OrderDTO.class);
    }

    @Transactional(readOnly = true)
    public OrderDTO getOrderById(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(()->new ResourceNotFoundException("Order not found with id " + orderId));
        return modelMapper.map(order, OrderDTO.class);
    }

    @Transactional(readOnly = true)
    public List<OrderDTO> getAllOrdersByCustomerId(Integer customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id " + customerId));

        List<Order> orders = orderRepository.findByCustomerCustomerId(customerId);
        return orders.stream()
                .map(order -> modelMapper.map(order, OrderDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderDTO updateOrder(Integer orderId, Integer quantity){
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id " + orderId));
        order.setQuantity(quantity);
        order.setTotalPrice(order.getItem().getPrice().multiply(BigDecimal.valueOf(quantity)));

        Order updateOrder = orderRepository.save(order);
        return modelMapper.map(updateOrder, OrderDTO.class);
    }

    @Transactional
    public OrderDTO deleteOrder(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id " + orderId));
        OrderDTO orderDTO = modelMapper.map(order, OrderDTO.class);
        orderRepository.delete(order);
        return orderDTO;
    }

    private String generateOrderCode() {
        // Generate a random order code with a maximum length of 20 characters
        return UUID.randomUUID().toString().replace("-", "").substring(0, 20).toUpperCase();
    }
}
