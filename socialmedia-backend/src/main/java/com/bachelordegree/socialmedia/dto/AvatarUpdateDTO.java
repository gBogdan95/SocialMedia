package com.bachelordegree.socialmedia.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AvatarUpdateDTO {
    @NotBlank
    private String newAvatarUrl;
}
