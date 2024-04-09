package com.bachelordegree.socialmedia.repository;

import com.bachelordegree.socialmedia.model.Conversation;
import com.bachelordegree.socialmedia.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ConversationRepository extends JpaRepository<Conversation, UUID> {
    @Query("SELECT c FROM Conversation c LEFT JOIN c.lastMessage m WHERE c.participantOne = :user OR c.participantTwo = :user ORDER BY m.sentAt DESC")
    List<Conversation> findAllByParticipantOrderByLastMessageSentAtDesc(@Param("user") User user);

    Optional<Conversation> findFirstByParticipantOneAndParticipantTwoOrParticipantOneAndParticipantTwo(
            User participantOne, User participantTwo, User participantTwoReversed, User participantOneReversed);
}