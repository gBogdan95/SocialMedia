package com.bachelordegree.socialmedia.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegistrationDTO {
    @NotEmpty(message = "Username is required")
    private String username;
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    @Email(message = "Email must be a valid email address")
    @NotEmpty(message = "Email is required")
    private String email;

    public String toString() {
        return "Registration info: username: " + this.username + " password: " + this.password + " email: " + this.email;
    }
}
