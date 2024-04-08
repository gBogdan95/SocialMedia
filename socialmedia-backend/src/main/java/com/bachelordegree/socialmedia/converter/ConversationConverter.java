package com.bachelordegree.socialmedia.converter;

import com.bachelordegree.socialmedia.dto.ConversationDTO;
import com.bachelordegree.socialmedia.model.Conversation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ConversationConverter {

    private final UserConverter userConverter;
    private final MessageConverter messageConverter;

    @Autowired
    public ConversationConverter(UserConverter userConverter, MessageConverter messageConverter) {
        this.userConverter = userConverter;
        this.messageConverter = messageConverter;
    }

    public ConversationDTO toDTO(Conversation conversation) {
        return new ConversationDTO(
                conversation.getId(),
                userConverter.toDTO(conversation.getParticipantOne()),
                userConverter.toDTO(conversation.getParticipantTwo()),
                conversation.getLastMessage() != null ? messageConverter.toDTO(conversation.getLastMessage()) : null
        );
    }
}