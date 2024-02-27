package com.bachelordegree.socialmedia.dto;

import com.bachelordegree.socialmedia.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponseDTO {
    private User user;
    private String jwt;
}