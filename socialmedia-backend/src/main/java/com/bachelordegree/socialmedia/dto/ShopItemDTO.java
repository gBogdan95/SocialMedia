package com.bachelordegree.socialmedia.dto;

import com.bachelordegree.socialmedia.model.ImageType;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
public class ShopItemDTO {
    private UUID id;
    private String imageUrl;
    private int price;
    private ImageType imageType;
}