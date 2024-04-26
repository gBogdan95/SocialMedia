package com.bachelordegree.socialmedia.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BackgroundUpdateDTO {
    @NotBlank
    private String newBackgroundUrl;
}