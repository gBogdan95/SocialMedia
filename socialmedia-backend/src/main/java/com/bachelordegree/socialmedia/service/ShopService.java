package com.bachelordegree.socialmedia.service;

import com.bachelordegree.socialmedia.exception.InsufficientFundsException;
import com.bachelordegree.socialmedia.model.ImageType;
import com.bachelordegree.socialmedia.model.Inventory;
import com.bachelordegree.socialmedia.model.ShopItem;
import com.bachelordegree.socialmedia.model.User;
import com.bachelordegree.socialmedia.repository.ShopItemRepository;
import com.bachelordegree.socialmedia.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ShopService {

    @Autowired
    private ShopItemRepository shopItemRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ShopItem> listAllItems() {
        return shopItemRepository.findAll();
    }

    @Transactional
    public Inventory purchaseImage(UUID itemId, Authentication authentication) throws InsufficientFundsException {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        ShopItem item = shopItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (user.getCurrency() < item.getPrice()) {
            throw new InsufficientFundsException("Insufficient funds to complete the transaction");
        }

        user.setCurrency(user.getCurrency() - item.getPrice());
        if (item.getImageType() == ImageType.PROFILE) {
            user.getInventory().getProfilePictureUrls().add(item.getImageUrl());
        } else {
            user.getInventory().getBackgroundPictureUrls().add(item.getImageUrl());
        }

        userRepository.save(user);
        return user.getInventory();
    }
}