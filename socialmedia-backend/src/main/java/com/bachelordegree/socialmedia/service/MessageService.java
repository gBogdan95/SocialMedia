package com.bachelordegree.socialmedia.service;

import com.bachelordegree.socialmedia.converter.MessageConverter;
import com.bachelordegree.socialmedia.dto.MessageContentDTO;
import com.bachelordegree.socialmedia.dto.MessageDTO;
import com.bachelordegree.socialmedia.exception.ConversationNotFoundException;
import com.bachelordegree.socialmedia.exception.DeleteMessageException;
import com.bachelordegree.socialmedia.exception.MessageNotFoundException;
import com.bachelordegree.socialmedia.exception.SendMessageException;
import com.bachelordegree.socialmedia.model.Conversation;
import com.bachelordegree.socialmedia.model.FriendshipStatus;
import com.bachelordegree.socialmedia.model.Message;
import com.bachelordegree.socialmedia.model.User;
import com.bachelordegree.socialmedia.repository.ConversationRepository;
import com.bachelordegree.socialmedia.repository.FriendshipRepository;
import com.bachelordegree.socialmedia.repository.MessageRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.*;

import static com.bachelordegree.socialmedia.exception.ConversationNotFoundException.ERR_MSG_CONVERSATION_NOT_FOUND;
import static com.bachelordegree.socialmedia.exception.DeleteMessageException.ERR_MSG_UNAUTHORIZED_TO_DELETE;
import static com.bachelordegree.socialmedia.exception.MessageNotFoundException.ERR_MSG_MESSAGE_NOT_FOUND;
import static com.bachelordegree.socialmedia.exception.SendMessageException.ERR_MSG_USER_BLOCKED_RECEIVING_MESSAGES;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final MessageConverter messageConverter;
    private final FriendshipRepository friendshipRepository;


    @Transactional
    public MessageDTO sendMessage(User sender, User receiver, MessageContentDTO messageContentDTO) throws SendMessageException, AccessDeniedException {
        if (sender.getId().equals(receiver.getId())) {
            throw new AccessDeniedException("Cannot send a message to oneself!");
        }

        if (!receiver.isAllowingMessagesFromNonFriends()) {
            boolean isFriend = friendshipRepository.findByUsersAndStatus(sender.getId(), receiver.getId(), FriendshipStatus.ACCEPTED)
                    .isPresent();
            if (!isFriend) {
                throw new SendMessageException(ERR_MSG_USER_BLOCKED_RECEIVING_MESSAGES);
            }
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
        message.setImageUrl(messageContentDTO.getImageUrl());
        message.setSentAt(LocalDateTime.now());
        message.setRead(false);
        message = messageRepository.save(message);

        conversation.setLastMessage(message);
        conversationRepository.save(conversation);

        return messageConverter.toDTO(message);
    }

    @Transactional
    public List<MessageDTO> getMessagesBetweenUsers(User caller, User otherUser) throws ConversationNotFoundException {
        if (caller.getId().equals(otherUser.getId())) {
            throw new IllegalArgumentException("Action now allowed!");
        }

        Optional<Conversation> conversation = conversationRepository
                .findFirstByParticipantOneAndParticipantTwoOrParticipantOneAndParticipantTwo(caller, otherUser, otherUser, caller);

        if (conversation.isEmpty()) {
            throw new ConversationNotFoundException(ERR_MSG_CONVERSATION_NOT_FOUND);
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

    @Transactional
    public void deleteMessage(UUID messageId, User currentUser) throws MessageNotFoundException, DeleteMessageException {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new MessageNotFoundException(ERR_MSG_MESSAGE_NOT_FOUND));

        if (!message.getSender().equals(currentUser)) {
            throw new DeleteMessageException(ERR_MSG_UNAUTHORIZED_TO_DELETE);
        }

        Conversation conversation = message.getConversation();
        boolean isLastMessage = conversation.getLastMessage().equals(message);

        if (isLastMessage) {
            conversation.setLastMessage(null);
            conversationRepository.save(conversation);
        }

        messageRepository.delete(message);

        List<Message> remainingMessages = messageRepository.findByConversationOrderBySentAtDesc(conversation);

        if (remainingMessages.isEmpty()) {
            conversationRepository.delete(conversation);
        } else if (isLastMessage) {
            conversation.setLastMessage(remainingMessages.get(0));
            conversationRepository.save(conversation);
        }
    }
}