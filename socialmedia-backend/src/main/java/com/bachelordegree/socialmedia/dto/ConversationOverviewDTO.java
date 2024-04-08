package com.bachelordegree.socialmedia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConversationOverviewDTO {
    private UUID conversationId;
    private UserDTO otherParticipant;
    private MessageDTO lastMessage;
}