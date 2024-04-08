package com.bachelordegree.socialmedia.converter;

import com.bachelordegree.socialmedia.dto.MessageDTO;
import com.bachelordegree.socialmedia.model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class MessageConverter {

    private final UserConverter userConverter;

    @Autowired
    public MessageConverter(UserConverter userConverter) {
        this.userConverter = userConverter;
    }

    public MessageDTO toDTO(Message message) {
        return new MessageDTO(
                message.getId(),
                message.getConversation().getId(),
                userConverter.toDTO(message.getSender()),
                message.getText(),
                message.getSentAt(),
                message.isRead()
        );
    }
}
