package com.bachelordegree.socialmedia.service;

import com.bachelordegree.socialmedia.converter.ConversationConverter;
import com.bachelordegree.socialmedia.converter.MessageConverter;
import com.bachelordegree.socialmedia.dto.MessageContentDTO;
import com.bachelordegree.socialmedia.dto.MessageDTO;
import com.bachelordegree.socialmedia.model.Conversation;
import com.bachelordegree.socialmedia.model.Message;
import com.bachelordegree.socialmedia.model.User;
import com.bachelordegree.socialmedia.repository.ConversationRepository;
import com.bachelordegree.socialmedia.repository.MessageRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final UserService userService;
    private final MessageConverter messageConverter;
    private final ConversationConverter conversationConverter;

    @Autowired
    public MessageService(MessageRepository messageRepository, ConversationRepository conversationRepository,
                          UserService userService, MessageConverter messageConverter,
                          ConversationConverter conversationConverter) {
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
        this.userService = userService;
        this.messageConverter = messageConverter;
        this.conversationConverter = conversationConverter;
    }

    @Transactional
    public MessageDTO sendMessage(User sender, User receiver, MessageContentDTO messageContentDTO) {
        if (sender.getId().equals(receiver.getId())) {
            throw new IllegalArgumentException("Cannot send a message to oneself.");
        }

        Conversation conversation = conversationRepository
                .findFirstByParticipantOneAndParticipantTwoOrParticipantOneAndParticipantTwo(sender, receiver, receiver, sender)
                .orElseGet(() -> {
                    Conversation newConversation = new Conversation();
                    newConversation.setParticipantOne(sender);
                    newConversation.setParticipantTwo(receiver);
                    return conversationRepository.save(newConversation);
                });

        Message message = new Message();
        message.setSender(sender);
        message.setConversation(conversation);
        message.setText(messageContentDTO.getText());
        message.setSentAt(LocalDateTime.now());
        message.setRead(false);
        message = messageRepository.save(message);

        conversation.setLastMessage(message);
        conversationRepository.save(conversation);

        return messageConverter.toDTO(message);
    }

    @Transactional
    public List<MessageDTO> getMessagesBetweenUsers(User caller, User otherUser) {
        if (caller.getId().equals(otherUser.getId())) {
            throw new IllegalArgumentException("Retrieving messages with oneself is not allowed.");
        }

        Optional<Conversation> conversation = conversationRepository
                .findFirstByParticipantOneAndParticipantTwoOrParticipantOneAndParticipantTwo(caller, otherUser, otherUser, caller);

        if (!conversation.isPresent()) {
            throw new IllegalArgumentException("No conversation found between the specified users.");
        }

        List<Message> messages = messageRepository.findByConversationOrderBySentAtDesc(conversation.get());

        messages.stream()
                .filter(message -> !message.isRead() && !message.getSender().equals(caller))
                .forEach(message -> {
                    message.setRead(true);
                    messageRepository.save(message);
                });

        return messages.stream().map(messageConverter::toDTO).toList();
    }
}