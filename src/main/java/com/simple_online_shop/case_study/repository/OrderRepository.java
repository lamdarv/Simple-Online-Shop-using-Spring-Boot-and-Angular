package com.simple_online_shop.case_study.repository;

import com.simple_online_shop.case_study.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.simple_online_shop.case_study.model.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    void deleteByCustomer(Customer customer);
}
