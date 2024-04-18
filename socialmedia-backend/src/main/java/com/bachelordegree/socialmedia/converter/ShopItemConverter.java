package com.bachelordegree.socialmedia.converter;

import com.bachelordegree.socialmedia.dto.ShopItemDTO;
import com.bachelordegree.socialmedia.model.ShopItem;
import org.springframework.stereotype.Component;

@Component
public class ShopItemConverter {
    public ShopItemDTO toDTO(ShopItem shopItem) {
        ShopItemDTO dto = new ShopItemDTO();
        dto.setId(shopItem.getId());
        dto.setImageUrl(shopItem.getImageUrl());
        dto.setPrice(shopItem.getPrice());
        dto.setImageType(shopItem.getImageType());
        return dto;
    }
}