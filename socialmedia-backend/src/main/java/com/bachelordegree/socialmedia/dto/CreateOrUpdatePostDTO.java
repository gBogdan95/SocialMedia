package com.bachelordegree.socialmedia.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CreateOrUpdatePostDTO {
    @NotBlank
    private String title;
    @NotBlank
    private String text;
    private String imageUrl;
}
