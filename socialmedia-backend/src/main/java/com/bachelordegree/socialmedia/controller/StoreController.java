package com.bachelordegree.socialmedia.controller;

import com.bachelordegree.socialmedia.converter.InventoryConverter;
import com.bachelordegree.socialmedia.converter.StoreItemConverter;
import com.bachelordegree.socialmedia.dto.InventoryDTO;
import com.bachelordegree.socialmedia.dto.StoreItemDTO;
import com.bachelordegree.socialmedia.exception.InsufficientFundsException;
import com.bachelordegree.socialmedia.exception.RestException;
import com.bachelordegree.socialmedia.model.Inventory;
import com.bachelordegree.socialmedia.model.StoreItem;
import com.bachelordegree.socialmedia.service.StoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/user/store")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class StoreController {

    @Autowired
    private StoreService storeService;

    @Autowired
    private StoreItemConverter storeItemConverter;

    @Autowired
    private InventoryConverter inventoryConverter;

    @GetMapping("/items")
    public List<StoreItemDTO> getAllStoreItems(Authentication authentication) {
        if (authentication == null) {
            throw new RestException(HttpStatus.UNAUTHORIZED, "You must be logged in to view items.");
        }

        List<StoreItem> items = storeService.listAllItems();
        return items.stream().map(storeItemConverter::toDTO).toList();
    }


    @PostMapping("/purchase/{itemId}")
    public InventoryDTO purchaseItem(@PathVariable UUID itemId, Authentication authentication) {
        try {
            Inventory updatedInventory = storeService.purchaseImage(itemId, authentication);
            return inventoryConverter.toDTO(updatedInventory);
        } catch (UsernameNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, "User not found: " + e.getMessage());
        } catch (InsufficientFundsException e) {
            throw new RestException(HttpStatus.BAD_REQUEST, "Insufficient funds: " + e.getMessage());
        }
    }
}

