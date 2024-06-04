package com.bachelordegree.socialmedia.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class UsernameUpdateRequestDTO {
    @NotEmpty(message = "New username is required")
    private String newUsername;
    @NotEmpty(message = "Password is required")
    private String password;
}
