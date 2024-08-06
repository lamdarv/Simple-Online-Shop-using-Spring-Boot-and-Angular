package com.simple_online_shop.case_study.controller;

import com.simple_online_shop.case_study.dto.CommonResponseDTO;
import com.simple_online_shop.case_study.dto.ItemDTO;
import com.simple_online_shop.case_study.exception.ResourceNotFoundException;
import com.simple_online_shop.case_study.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {
    @Autowired
    private final ItemService itemService;

    public ItemController (ItemService itemService) {
        this.itemService = itemService;
    }

    @PostMapping("/create")
    public ResponseEntity<CommonResponseDTO<ItemDTO>> createItem(
            @RequestParam("itemsName") String itemsName,
            @RequestParam("itemsCode") String itemsCode,
            @RequestParam("stock") Integer stock,
            @RequestParam("price") BigDecimal price,
            @RequestParam("isAvailable") Boolean isAvailable,
            @RequestParam(value = "lastReStock", required = false) String lastReStock) {

        try {
            ItemDTO itemDTO = itemService.createItem(itemsName, itemsCode, stock, price, isAvailable, lastReStock);
            CommonResponseDTO<ItemDTO> response = new CommonResponseDTO<>("Item created successfully", itemDTO);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            CommonResponseDTO<ItemDTO> response = new CommonResponseDTO<>(e.getMessage(), null);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            CommonResponseDTO<ItemDTO> response = new CommonResponseDTO<>("An error occurred while creating the item.", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PutMapping("/{itemsId}")
    public ResponseEntity<CommonResponseDTO<ItemDTO>> updateItem(
            @PathVariable Integer itemsId,
            @RequestParam(value = "itemsName", required = false) String itemsName,
            @RequestParam(value = "itemsCode", required = false) String itemsCode,
            @RequestParam(value = "stock", required = false) Integer stock,
            @RequestParam(value = "price", required = false) BigDecimal price,
            @RequestParam(value = "isAvailable", required = false) Boolean isAvailable,
            @RequestParam(value = "lastReStock", required = false) String lastReStock) {
        try {
            ItemDTO itemDTO = itemService.updateItem(itemsId, itemsName, itemsCode, stock, price,
                    isAvailable, lastReStock);
            CommonResponseDTO<ItemDTO> response = new CommonResponseDTO<>("Item updated successfully", itemDTO);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            CommonResponseDTO<ItemDTO> response = new CommonResponseDTO<>(e.getMessage(), null);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            CommonResponseDTO<ItemDTO> response = new CommonResponseDTO<>("An error occurred while updating the order.", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping
    public ResponseEntity<CommonResponseDTO<List<ItemDTO>>> getAllItems() {
        try {
            List<ItemDTO> itemDTOList = itemService.getAllItems();
            CommonResponseDTO<List<ItemDTO>> response = new CommonResponseDTO<>("Items fetched successfully", itemDTOList);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            CommonResponseDTO<List<ItemDTO>> response = new CommonResponseDTO<>(e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            CommonResponseDTO<List<ItemDTO>> response = new CommonResponseDTO<>("An error occurred while fetching items.", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/{itemsId}")
    public ResponseEntity<CommonResponseDTO<ItemDTO>> getAllItemById(@PathVariable Integer itemsId) {
        try {
            ItemDTO itemDTO = itemService.getAllItemById(itemsId);
            CommonResponseDTO<ItemDTO> response = new CommonResponseDTO<>("Item fetched successfully", itemDTO);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            CommonResponseDTO<ItemDTO> response = new CommonResponseDTO<>(e.getMessage(), null);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            CommonResponseDTO<ItemDTO> response = new CommonResponseDTO<>("An error occurred while fetching the item.", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

    }

    @DeleteMapping("/{itemsId}")
    public ResponseEntity<String> deleteItem(@PathVariable Integer itemsId) {
        try {
            itemService.deleteItem(itemsId);
            return ResponseEntity.ok("Item deleted successfully.");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the item.");
        }
    }
}
