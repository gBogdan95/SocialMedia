package com.bachelordegree.socialmedia.service;

import com.bachelordegree.socialmedia.converter.MessageConverter;
import com.bachelordegree.socialmedia.converter.UserConverter;
import com.bachelordegree.socialmedia.dto.ConversationOverviewDTO;
import com.bachelordegree.socialmedia.dto.MessageDTO;
import com.bachelordegree.socialmedia.model.Conversation;
import com.bachelordegree.socialmedia.model.User;
import com.bachelordegree.socialmedia.repository.ConversationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConversationService {
    private final ConversationRepository conversationRepository;
    private final UserConverter userConverter;
    private final MessageConverter messageConverter;

    @Transactional
    public List<ConversationOverviewDTO> getAllConversationsForUser(User user) {
        List<Conversation> conversations = conversationRepository.findAllByParticipant(user);
        return conversations.stream()
                .map(conversation -> {
                    User otherParticipant = conversation.getParticipantOne().equals(user) ? conversation.getParticipantTwo() : conversation.getParticipantOne();
                    MessageDTO lastMessageDTO = messageConverter.toDTO(conversation.getLastMessage());
                    return new ConversationOverviewDTO(
                            conversation.getId(),
                            userConverter.toDTO(otherParticipant),
                            lastMessageDTO
                    );
                }).toList();
    }
}