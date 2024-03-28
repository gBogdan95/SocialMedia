package com.bachelordegree.socialmedia.service;

import com.bachelordegree.socialmedia.model.Friendship;
import com.bachelordegree.socialmedia.model.FriendshipStatus;
import com.bachelordegree.socialmedia.model.User;
import com.bachelordegree.socialmedia.repository.FriendshipRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FriendshipService {
    private final FriendshipRepository friendshipRepository;

    public void sendFriendRequest(User requester, User receiver) {
        if (requester.getUsername().equals(receiver.getUsername())) {
            throw new IllegalArgumentException("Cannot send friend request to oneself.");
        }

        boolean exists = friendshipRepository.existsByRequesterAndReceiverAndStatus(
                requester, receiver, FriendshipStatus.PENDING) ||
                friendshipRepository.existsByRequesterAndReceiverAndStatus(
                        requester, receiver, FriendshipStatus.ACCEPTED);

        if (exists) {
            throw new IllegalStateException("Friend request already sent or users are already friends.");
        }

        Friendship friendRequest = new Friendship();
        friendRequest.setRequester(requester);
        friendRequest.setReceiver(receiver);
        friendRequest.setStatus(FriendshipStatus.PENDING);

        friendshipRepository.save(friendRequest);
    }

    public void acceptFriendRequest(UUID friendshipId, User receiver) {
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new EntityNotFoundException("Friend request not found."));

        if (!friendship.getReceiver().equals(receiver)) {
            throw new IllegalStateException("Only the receiver can accept the friend request.");
        }

        if (!friendship.getStatus().equals(FriendshipStatus.PENDING)) {
            throw new IllegalStateException("The friend request is not in a pending state.");
        }

        friendship.setStatus(FriendshipStatus.ACCEPTED);
        friendshipRepository.save(friendship);
    }

    public void declineFriendRequest(UUID friendshipId, User receiver) {
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new EntityNotFoundException("Friend request not found."));

        if (!friendship.getReceiver().equals(receiver)) {
            throw new IllegalStateException("Only the receiver can decline the friend request.");
        }

        if (!friendship.getStatus().equals(FriendshipStatus.PENDING)) {
            throw new IllegalStateException("The friend request is not in a pending state.");
        }

        friendshipRepository.delete(friendship);
    }

    public List<Friendship> listPendingFriendRequests(User receiver) {
        return friendshipRepository.findByReceiverAndStatus(receiver, FriendshipStatus.PENDING);
    }

    public List<User> listFriends(User user) {
        List<Friendship> friendships = friendshipRepository.findAllByRequesterAndStatus(user, FriendshipStatus.ACCEPTED);
        friendships.addAll(friendshipRepository.findAllByReceiverAndStatus(user, FriendshipStatus.ACCEPTED));

        return friendships.stream()
                .map(friendship -> friendship.getRequester().equals(user) ? friendship.getReceiver() : friendship.getRequester())
                .toList();
    }

    public void removeFriend(User user, UUID friendId) {
        Friendship friendship = friendshipRepository.findByUsersAndStatus(user.getId(), friendId, FriendshipStatus.ACCEPTED)
                .orElseThrow(() -> new EntityNotFoundException("Friendship not found."));

        friendshipRepository.delete(friendship);
    }

    public FriendshipStatus checkFriendshipStatus(UUID userId, UUID friendId) {
        Optional<Friendship> friendship = friendshipRepository.findByUsers(userId, friendId);
        return friendship.map(Friendship::getStatus).orElse(FriendshipStatus.NONE);
    }

}
