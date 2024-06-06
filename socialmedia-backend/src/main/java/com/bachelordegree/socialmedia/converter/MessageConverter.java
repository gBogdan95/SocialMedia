package com.bachelordegree.socialmedia.converter;

import com.bachelordegree.socialmedia.dto.MessageContentDTO;
import com.bachelordegree.socialmedia.dto.MessageDTO;
import com.bachelordegree.socialmedia.model.Conversation;
import com.bachelordegree.socialmedia.model.Message;
import com.bachelordegree.socialmedia.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

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
                message.getImageUrl(),
                message.getSentAt(),
                message.isRead()
        );
    }

    public Message toEntity(MessageContentDTO messageContentDTO, User sender, Conversation conversation) {
        Message message = new Message();
        message.setSender(sender);
        message.setConversation(conversation);
        message.setText(messageContentDTO.getText());
        message.setImageUrl(messageContentDTO.getImageUrl());
        message.setSentAt(LocalDateTime.now());
        return message;
    }
}