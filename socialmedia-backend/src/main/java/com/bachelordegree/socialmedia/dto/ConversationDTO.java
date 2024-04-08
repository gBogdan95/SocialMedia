package com.bachelordegree.socialmedia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConversationDTO {
    private UUID id;
    private UserDTO participantOne;
    private UserDTO participantTwo;
    private MessageDTO lastMessage;
}