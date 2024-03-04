package com.bachelordegree.socialmedia.dto;

import com.bachelordegree.socialmedia.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponseDTO {
    private UserDTO user;
    private String jwt;
}