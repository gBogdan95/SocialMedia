package com.bachelordegree.socialmedia.service;

import com.bachelordegree.socialmedia.converter.MessageConverter;
import com.bachelordegree.socialmedia.dto.MessageContentDTO;
import com.bachelordegree.socialmedia.dto.MessageDTO;
import com.bachelordegree.socialmedia.model.Message;
import com.bachelordegree.socialmedia.model.User;
import com.bachelordegree.socialmedia.repository.MessageRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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

    @Transactional
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

    @Transactional
    public List<MessageDTO> getMessagesBetweenUsers(User caller, User otherUser) {
        if (caller.getId().equals(otherUser.getId())) {
            throw new IllegalArgumentException("Retrieving messages with oneself is not allowed.");
        }

        List<Message> messages = messageRepository.findBySenderAndReceiverOrReceiverAndSenderOrderBySentAtAsc(caller, otherUser, caller, otherUser);

        messages.stream()
                .filter(message -> message.getReceiver().equals(caller) && !message.isRead())
                .forEach(message -> {
                    message.setRead(true);
                    messageRepository.save(message);
                });

        return messages.stream().map(messageConverter::toDTO).toList();
    }

}

