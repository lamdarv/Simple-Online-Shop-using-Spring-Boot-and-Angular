package com.simple_online_shop.case_study.repository;

import com.simple_online_shop.case_study.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
}
