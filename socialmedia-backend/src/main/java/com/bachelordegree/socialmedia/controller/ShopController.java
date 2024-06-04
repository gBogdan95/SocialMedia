package com.bachelordegree.socialmedia.controller;

import com.bachelordegree.socialmedia.converter.InventoryConverter;
import com.bachelordegree.socialmedia.converter.ShopItemConverter;
import com.bachelordegree.socialmedia.dto.InventoryDTO;
import com.bachelordegree.socialmedia.dto.ShopItemDTO;
import com.bachelordegree.socialmedia.exception.InsufficientFundsException;
import com.bachelordegree.socialmedia.exception.ItemAlreadyOwnedException;
import com.bachelordegree.socialmedia.exception.RestException;
import com.bachelordegree.socialmedia.exception.ShopItemNotFoundException;
import com.bachelordegree.socialmedia.model.Inventory;
import com.bachelordegree.socialmedia.model.ShopItem;
import com.bachelordegree.socialmedia.service.ShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/user/shop")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ShopController {

    @Autowired
    private ShopService shopService;

    @Autowired
    private ShopItemConverter shopItemConverter;

    @Autowired
    private InventoryConverter inventoryConverter;

    @GetMapping("/items")
    public List<ShopItemDTO> getAllShopItems() {
        List<ShopItem> items = shopService.listAllItems();
        return items.stream().map(shopItemConverter::toDTO).toList();
    }

    @PostMapping("/purchase/{itemId}")
    public InventoryDTO purchaseItem(@PathVariable UUID itemId, Authentication authentication) {
        try {
            String username = authentication.getName();
            Inventory updatedInventory = shopService.purchaseImage(itemId, username);
            return inventoryConverter.toDTO(updatedInventory);
        } catch (UsernameNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, "User not found: " + e.getMessage());
        } catch (InsufficientFundsException | ItemAlreadyOwnedException | ShopItemNotFoundException e) {
            throw new RestException(HttpStatus.BAD_REQUEST,e.getMessage());
        }
    }
}