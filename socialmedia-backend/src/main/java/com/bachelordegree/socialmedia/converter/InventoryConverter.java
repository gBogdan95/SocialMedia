package com.bachelordegree.socialmedia.converter;

import com.bachelordegree.socialmedia.dto.InventoryDTO;
import com.bachelordegree.socialmedia.model.Inventory;
import org.springframework.stereotype.Component;

import java.util.HashSet;

@Component
public class InventoryConverter {

    public InventoryDTO toDTO(Inventory inventory) {
        if (inventory == null) {
            return null;
        }
        InventoryDTO inventoryDTO = new InventoryDTO();
        inventoryDTO.setId(inventory.getId());
        inventoryDTO.setProfilePictureUrls(new HashSet<>(inventory.getProfilePictureUrls()));
        inventoryDTO.setBackgroundPictureUrls(new HashSet<>(inventory.getBackgroundPictureUrls()));
        return inventoryDTO;
    }
}