package com.bachelordegree.socialmedia.converter;

import com.bachelordegree.socialmedia.dto.InventoryDTO;
import com.bachelordegree.socialmedia.dto.UserDTO;
import com.bachelordegree.socialmedia.dto.UserProfileUpdateDTO;
import com.bachelordegree.socialmedia.model.Inventory;
import com.bachelordegree.socialmedia.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashSet;

@Component
public class UserConverter {

    public UserDTO toDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setAvatarUrl(user.getAvatarUrl());
        userDTO.setBackgroundUrl(user.getBackgroundUrl());
        userDTO.setCurrency(user.getCurrency());
        userDTO.setName(user.getName());
        userDTO.setPhoneNumber(user.getPhoneNumber());
        userDTO.setDescription(user.getDescription());
        userDTO.setAllowingFriendRequests(user.isAllowingFriendRequests());
        userDTO.setAllowingMessagesFromNonFriends(user.isAllowingMessagesFromNonFriends());
        return userDTO;
    }
}