package com.bachelordegree.socialmedia.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class PasswordUpdateRequestDTO {
    @NotEmpty(message = "Current password is required")
    private String currentPassword;
    @NotEmpty(message = "Password is required")
    private String newPassword;
}