package com.bachelordegree.socialmedia.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
public class CommentDTO {

    @NotNull
    private UUID id;

    @NotBlank
    private String text;

    private int likes;

}