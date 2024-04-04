package com.bachelordegree.socialmedia.repository;

import com.bachelordegree.socialmedia.model.Message;
import com.bachelordegree.socialmedia.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {
    List<Message> findBySenderAndReceiverOrReceiverAndSenderOrderBySentAtAsc(User sender, User receiver, User receiver2, User sender2);
}