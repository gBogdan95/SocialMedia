package com.bachelordegree.socialmedia.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
public class PostDTO {
    private UUID id;
    @NotBlank
    private String title;
    @NotBlank
    private String text;
    private String imageUrl;
    private int likes;
    private int totalComments;
    private UserDTO user;
    private boolean isLiked;
}