package com.bachelordegree.socialmedia.service;

import com.bachelordegree.socialmedia.exception.InsufficientFundsException;
import com.bachelordegree.socialmedia.exception.ItemAlreadyOwnedException;
import com.bachelordegree.socialmedia.exception.ShopItemNotFoundException;
import com.bachelordegree.socialmedia.model.ImageType;
import com.bachelordegree.socialmedia.model.Inventory;
import com.bachelordegree.socialmedia.model.ShopItem;
import com.bachelordegree.socialmedia.model.User;
import com.bachelordegree.socialmedia.repository.ShopItemRepository;
import com.bachelordegree.socialmedia.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import static com.bachelordegree.socialmedia.exception.InsufficientFundsException.ERR_MSG_INSUFFICIENT_FUNDS;
import static com.bachelordegree.socialmedia.exception.ItemAlreadyOwnedException.ERR_MSG_ITEM_ALREADY_OWNED;
import static com.bachelordegree.socialmedia.exception.ShopItemNotFoundException.ERR_MSG_SHOP_ITEM_NOT_FOUND;

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
    public Inventory purchaseImage(UUID itemId, String username) throws InsufficientFundsException, ItemAlreadyOwnedException, ShopItemNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        ShopItem item = shopItemRepository.findById(itemId)
                .orElseThrow(() -> new ShopItemNotFoundException(ERR_MSG_SHOP_ITEM_NOT_FOUND));

        if (user.getCurrency() < item.getPrice()) {
            throw new InsufficientFundsException(ERR_MSG_INSUFFICIENT_FUNDS);
        }

        Set<String> ownedItems = item.getImageType() == ImageType.PROFILE ?
                user.getInventory().getProfilePictureUrls() :
                user.getInventory().getBackgroundPictureUrls();

        if (ownedItems.contains(item.getImageUrl())) {
            throw new ItemAlreadyOwnedException(ERR_MSG_ITEM_ALREADY_OWNED);
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