package com.bachelordegree.socialmedia.repository;

import com.bachelordegree.socialmedia.model.Conversation;
import com.bachelordegree.socialmedia.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {
    List<Message> findByConversationOrderBySentAtDesc(Conversation conversation);
}