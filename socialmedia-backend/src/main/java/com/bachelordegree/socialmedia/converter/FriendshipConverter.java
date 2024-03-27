package com.bachelordegree.socialmedia.converter;

import com.bachelordegree.socialmedia.dto.FriendshipDTO;
import com.bachelordegree.socialmedia.model.Friendship;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class FriendshipConverter {

    private final UserConverter userConverter;

    @Autowired
    public FriendshipConverter(UserConverter userConverter) {
        this.userConverter = userConverter;
    }

    public FriendshipDTO toDTO(Friendship friendship) {
        FriendshipDTO dto = new FriendshipDTO();
        dto.setId(friendship.getId());
        dto.setRequester(userConverter.toDTO(friendship.getRequester()));
        dto.setStatus(friendship.getStatus().toString());
        return dto;
    }
}

