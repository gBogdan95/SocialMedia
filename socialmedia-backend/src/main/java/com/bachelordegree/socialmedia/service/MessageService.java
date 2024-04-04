package com.bachelordegree.socialmedia.service;

import com.bachelordegree.socialmedia.converter.MessageConverter;
import com.bachelordegree.socialmedia.dto.MessageContentDTO;
import com.bachelordegree.socialmedia.dto.MessageDTO;
import com.bachelordegree.socialmedia.model.Message;
import com.bachelordegree.socialmedia.model.User;
import com.bachelordegree.socialmedia.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserService userService;
    private final MessageConverter messageConverter;

    @Autowired
    public MessageService(MessageRepository messageRepository, UserService userService, MessageConverter messageConverter) {
        this.messageRepository = messageRepository;
        this.userService = userService;
        this.messageConverter = messageConverter;
    }

    public MessageDTO sendMessage(User sender, User receiver, MessageContentDTO messageContentDTO) {
        if (sender.getId().equals(receiver.getId())) {
            throw new IllegalArgumentException("Cannot send a message to oneself.");
        }

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setText(messageContentDTO.getText());
        message = messageRepository.save(message);

        return messageConverter.toDTO(message);
    }
}

