package com.simple_online_shop.case_study.controller;

import com.simple_online_shop.case_study.dto.CustomerDTO;
import com.simple_online_shop.case_study.dto.ItemDTO;
import com.simple_online_shop.case_study.exception.CustomerDeletionException;
import com.simple_online_shop.case_study.exception.ResourceNotFoundException;
import com.simple_online_shop.case_study.model.Customer;
import com.simple_online_shop.case_study.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/items")
public class ItemController {
    @Autowired
    private final ItemService itemService;



    public ItemController (ItemService itemService) {
        this.itemService = itemService;
    }

    @PostMapping("/create")
    public ResponseEntity<ItemDTO> createItem(
            @RequestParam("itemsName") String itemsName,
            @RequestParam("itemsCode") String itemsCode,
            @RequestParam("stock") Integer stock,
            @RequestParam("price") BigDecimal price,
            @RequestParam("isAvailable") Boolean isAvailable,
            @RequestParam(value = "lastReStock", required = false) String lastReStock) {

        ItemDTO response = itemService.createItem(itemsName, itemsCode, stock, price, isAvailable, lastReStock);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{itemsId}")
    public ResponseEntity<ItemDTO> updateItem(
            @PathVariable Integer itemsId,
            @RequestParam(value = "itemsName", required = false) String itemsName,
            @RequestParam(value = "itemsCode", required = false) String itemsCode,
            @RequestParam(value = "stock", required = false) Integer stock,
            @RequestParam(value = "price", required = false) BigDecimal price,
            @RequestParam(value = "isAvailable", required = false) Boolean isAvailable,
            @RequestParam(value = "lastReStock", required = false) String lastReStock) {
        ItemDTO response = itemService.updateItem(itemsId, itemsName, itemsCode, stock, price, isAvailable,
                lastReStock);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ItemDTO>> getAllItems() {
        List<ItemDTO> items = itemService.getAllItems();
        return ResponseEntity.ok(items);
    }

    @GetMapping("/{itemsId}")
    public ResponseEntity<ItemDTO> getAllItemById(@PathVariable Integer itemsId) {
        ItemDTO itemDTO = itemService.getAllItemById(itemsId);
        return ResponseEntity.ok(itemDTO);
    }

    @DeleteMapping("/{itemsId}")
    public ResponseEntity<String> deleteItem(@PathVariable Integer itemsId) {
        try {
            itemService.deleteItem(itemsId);
            return ResponseEntity.ok("Item with id " + itemsId + " has been successfully deleted.");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (CustomerDeletionException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

}
