package com.bachelordegree.socialmedia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private UUID id;
    private String username;
    private String email;
    private String avatarUrl;
    private String backgroundUrl;
    private int currency;
    private String name;
    private String phoneNumber;
    private String description;
    private boolean isAllowingFriendRequests;
    private boolean isAllowingMessagesFromNonFriends;
}