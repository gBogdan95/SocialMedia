package com.bachelordegree.socialmedia.repository;

import com.bachelordegree.socialmedia.model.Friendship;
import com.bachelordegree.socialmedia.model.FriendshipStatus;
import com.bachelordegree.socialmedia.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FriendshipRepository extends JpaRepository<Friendship, UUID> {
    List<Friendship> findByReceiverAndStatus(User receiver, FriendshipStatus status);
    List<Friendship> findAllByRequesterAndStatus(User requester, FriendshipStatus status);
    List<Friendship> findAllByReceiverAndStatus(User receiver, FriendshipStatus status);
    @Query("SELECT f FROM Friendship f WHERE (f.requester.id = :userId AND f.receiver.id = :friendId) OR (f.requester.id = :friendId AND f.receiver.id = :userId)")
    Optional<Friendship> findFriendshipBetweenUsers(@Param("userId") UUID userId, @Param("friendId") UUID friendId);

    @Query("SELECT f FROM Friendship f WHERE ((f.requester.id = :userId AND f.receiver.id = :friendId) OR (f.requester.id = :friendId AND f.receiver.id = :userId)) AND f.status = :status")
    Optional<Friendship> findByUsersAndStatus(UUID userId, UUID friendId, FriendshipStatus status);

    @Query("SELECT f FROM Friendship f WHERE (f.requester.id = :userId AND f.receiver.id = :friendId) OR (f.requester.id = :friendId AND f.receiver.id = :userId)")
    Optional<Friendship> findByUsers(@Param("userId") UUID userId, @Param("friendId") UUID friendId);
}