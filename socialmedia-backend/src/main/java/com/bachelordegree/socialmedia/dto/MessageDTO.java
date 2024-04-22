package com.bachelordegree.socialmedia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageDTO {
    private UUID id;
    private UUID conversationId;
    private UserDTO sender;
    private String text;
    private String imageUrl;
    private LocalDateTime sentAt;
    private boolean read;
}