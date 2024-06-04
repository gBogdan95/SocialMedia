package com.bachelordegree.socialmedia.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
public class CommentDTO {
    private UUID id;
    @NotBlank
    private String text;
    private int likes;
    private UserDTO user;
    private boolean isLiked;
}