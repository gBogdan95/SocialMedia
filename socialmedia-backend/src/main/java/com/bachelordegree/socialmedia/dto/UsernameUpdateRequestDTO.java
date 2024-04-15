package com.bachelordegree.socialmedia.dto;


import lombok.Data;

@Data
public class UsernameUpdateRequestDTO {
    private String newUsername;
    private String password;
}
