package com.bachelordegree.socialmedia.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "conversations")
@Data
@NoArgsConstructor
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToMany(mappedBy = "conversation")
    private List<Message> messages = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "last_message_id")
    private Message lastMessage;

    @ManyToOne
    @JoinColumn(name = "participant_one_id", nullable = false)
    private User participantOne;

    @ManyToOne
    @JoinColumn(name = "participant_two_id", nullable = false)
    private User participantTwo;
}