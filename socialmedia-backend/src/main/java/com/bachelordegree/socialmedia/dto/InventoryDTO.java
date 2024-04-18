package com.bachelordegree.socialmedia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InventoryDTO {
    private UUID id;
    private Set<String> profilePictureUrls;
    private Set<String> backgroundPictureUrls;
}