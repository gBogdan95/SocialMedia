package com.bachelordegree.socialmedia.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class EmailUpdateRequestDTO {
    @NotEmpty(message = "Password is required")
    private String password;
    @Email(message = "Email must be a valid email address")
    @NotEmpty(message = "Email is required")
    private String newEmail;
}

