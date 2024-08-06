package com.simple_online_shop.case_study.service;

import com.simple_online_shop.case_study.dto.CustomerDTO;
import com.simple_online_shop.case_study.dto.ItemDTO;
import com.simple_online_shop.case_study.exception.CustomerDeletionException;
import com.simple_online_shop.case_study.exception.ItemDeletionException;
import com.simple_online_shop.case_study.exception.ResourceNotFoundException;
import com.simple_online_shop.case_study.model.Customer;
import com.simple_online_shop.case_study.model.Item;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class ItemService {
    private final ItemRepository itemRepository;
    private final ModelMapper modelMapper;
    private final OrderRepository orderRepository;

    @Transactional
    public ItemDTO createItem(String itemsName, String itemsCode, Integer stock,
                              BigDecimal price, Boolean isAvailable, String lastReStock) {
        ItemDTO itemDTO = buildItemDTO(itemsName, itemsCode, stock, price, isAvailable, lastReStock);
        return saveItem(null, itemDTO);
    }

    @Transactional
    public ItemDTO updateItem(Integer itemsId, String itemsName, String itemsCode, Integer stock,
                                  BigDecimal price, Boolean isAvailable, String lastReStock) {
        ItemDTO itemDTO = buildItemDTO(itemsName, itemsCode, stock, price, isAvailable, lastReStock);
        return saveItem(itemsId, itemDTO);
    }

    @Transactional
    public List<ItemDTO> getAllItems() {
        return itemRepository.findAll().stream()
                .map(item -> modelMapper.map(item, ItemDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public ItemDTO getAllItemById(Integer itemsId) {
        Item item = itemRepository.findById(itemsId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id " + itemsId));
        return modelMapper.map(item, ItemDTO.class);
    }

    @Transactional
    public void deleteItem(Integer itemsId) throws CustomerDeletionException {
        Item item = itemRepository.findById(itemsId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id " + itemsId));

        try {
            // Delete orders related to the item
            orderRepository.deleteByItem(item);

            // Delete the item
            itemRepository.deleteById(itemsId);
        } catch (Exception e) {
            throw new ItemDeletionException("Failed to delete item with id " + itemsId, e);
        }
    }

    private ItemDTO buildItemDTO(String itemsName, String itemsCode, Integer stock,
                                 BigDecimal price, Boolean isAvailable, String lastReStock) {
        ItemDTO itemDTO = new ItemDTO();
        itemDTO.setItemsName(itemsName);
        itemDTO.setItemsCode(itemsCode);
        itemDTO.setStock(stock);
        itemDTO.setPrice(price);
        itemDTO.setIsAvailable(isAvailable);
        if (lastReStock != null) {
            itemDTO.setLastReStock(LocalDateTime.parse(lastReStock));
        }
        return itemDTO;
    }

    private ItemDTO saveItem(Integer itemId, ItemDTO itemDTO) {
        Item item = (itemId != null) ? findItemById(itemId) : new Item();
        updateItemEntity(item, itemDTO);

        Item updatedItem = itemRepository.save(item);
        return modelMapper.map(updatedItem, ItemDTO.class);
    }

    private void updateItemEntity(Item item, ItemDTO itemDTO) {
        if (itemDTO.getItemsName() != null) item.setItemsName(itemDTO.getItemsName());
        if (itemDTO.getItemsCode() != null) item.setItemsCode(itemDTO.getItemsCode());
        if (itemDTO.getStock() != null) item.setStock(itemDTO.getStock());
        if (itemDTO.getPrice() != null) item.setPrice(itemDTO.getPrice());
        if (itemDTO.getIsAvailable() != null) item.setIsAvailable(itemDTO.getIsAvailable());
        if (itemDTO.getLastReStock() != null) item.setLastReStock(itemDTO.getLastReStock());
    }

    private Item findItemById(Integer itemId) {
        return itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id " + itemId));
    }
}
