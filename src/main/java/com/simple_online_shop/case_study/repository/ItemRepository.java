package com.simple_online_shop.case_study.repository;

import com.simple_online_shop.case_study.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Integer> {
}
