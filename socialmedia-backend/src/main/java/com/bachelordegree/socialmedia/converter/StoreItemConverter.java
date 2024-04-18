package com.bachelordegree.socialmedia.converter;

import com.bachelordegree.socialmedia.dto.StoreItemDTO;
import com.bachelordegree.socialmedia.model.StoreItem;
import org.springframework.stereotype.Component;

@Component
public class StoreItemConverter {
    public StoreItemDTO toDTO(StoreItem storeItem) {
        StoreItemDTO dto = new StoreItemDTO();
        dto.setId(storeItem.getId());
        dto.setImageUrl(storeItem.getImageUrl());
        dto.setPrice(storeItem.getPrice());
        dto.setImageType(storeItem.getImageType());
        return dto;
    }
}