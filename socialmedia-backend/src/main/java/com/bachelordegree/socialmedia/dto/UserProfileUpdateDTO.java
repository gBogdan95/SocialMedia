package com.bachelordegree.socialmedia.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileUpdateDTO {
    @Size(max = 16, message = "Name must not exceed 16 characters")
    private String name;
    @Size(max = 10, message = "Phone Number must not exceed 10 characters")
    private String phoneNumber;
    private String description;
}