package com.bachelordegree.socialmedia.service;

import com.bachelordegree.socialmedia.converter.MessageConverter;
import com.bachelordegree.socialmedia.converter.UserConverter;
import com.bachelordegree.socialmedia.dto.MessageContentDTO;
import com.bachelordegree.socialmedia.dto.MessageDTO;
import com.bachelordegree.socialmedia.model.Conversation;
import com.bachelordegree.socialmedia.model.Message;
import com.bachelordegree.socialmedia.model.User;
import com.bachelordegree.socialmedia.repository.ConversationRepository;
import com.bachelordegree.socialmedia.repository.MessageRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final UserConverter userConverter;
    private final MessageConverter messageConverter;


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

        if (conversation.isEmpty()) {
            throw new IllegalArgumentException("No conversation found between the specified users.");
        }

        List<Message> messages = messageRepository.findByConversationOrderBySentAtAsc(conversation.get());

        messages.stream()
                .filter(message -> !message.isRead() && !message.getSender().equals(caller))
                .forEach(message -> {
                    message.setRead(true);
                    messageRepository.save(message);
                });

        return messages.stream().map(messageConverter::toDTO).toList();
    }
}