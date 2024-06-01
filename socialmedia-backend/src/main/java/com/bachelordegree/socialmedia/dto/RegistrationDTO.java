package com.bachelordegree.socialmedia.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegistrationDTO {
    @NotEmpty
    private String username;
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    @Email
    @NotEmpty
    private String email;
}
