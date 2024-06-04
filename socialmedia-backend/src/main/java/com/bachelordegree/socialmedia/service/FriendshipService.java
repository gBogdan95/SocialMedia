package com.bachelordegree.socialmedia.service;

import com.bachelordegree.socialmedia.exception.FriendRequestException;
import com.bachelordegree.socialmedia.exception.FriendshipNotFoundException;
import com.bachelordegree.socialmedia.model.Friendship;
import com.bachelordegree.socialmedia.model.FriendshipStatus;
import com.bachelordegree.socialmedia.model.User;
import com.bachelordegree.socialmedia.repository.FriendshipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.bachelordegree.socialmedia.exception.FriendRequestException.*;
import static com.bachelordegree.socialmedia.exception.FriendshipNotFoundException.ERR_MSG_FRIENDSHIP_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class FriendshipService {
    private final FriendshipRepository friendshipRepository;

    public void sendFriendRequest(User requester, User receiver) throws FriendRequestException {
        if (requester.getId().equals(receiver.getId())) {
            throw new FriendRequestException(ERR_MSG_CANNOT_SNE_FRIEND_REQUEST_TO_ONESELF);
        }

        if (!receiver.isAllowingFriendRequests()) {
            throw new FriendRequestException(ERR_MSG_USER_BLOCKED_RECEIVING_FRIEND_REQUESTS);
        }

        Optional<Friendship> existingFriendship = friendshipRepository.findFriendshipBetweenUsers(requester.getId(), receiver.getId());

        if (existingFriendship.isPresent()) {
            FriendshipStatus status = existingFriendship.get().getStatus();
            if (status == FriendshipStatus.PENDING) {
                throw new FriendRequestException(ERR_MSG_FRIEND_REQUEST_ALREADY_SENT);
            } else if (status == FriendshipStatus.ACCEPTED) {
                throw new FriendRequestException(ERR_MSG_FRIEND_ALREADY_FRIENDS);
            }
        } else {
            Friendship friendRequest = new Friendship();
            friendRequest.setRequester(requester);
            friendRequest.setReceiver(receiver);
            friendRequest.setStatus(FriendshipStatus.PENDING);
            friendshipRepository.save(friendRequest);
        }
    }

    public void acceptFriendRequest(UUID friendshipId, User receiver) throws FriendshipNotFoundException, AccessDeniedException {
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new FriendshipNotFoundException(ERR_MSG_FRIENDSHIP_NOT_FOUND));

        if (!friendship.getReceiver().equals(receiver)) {
            throw new AccessDeniedException("Only the receiver can accept the friend request.");
        }

        if (!friendship.getStatus().equals(FriendshipStatus.PENDING)) {
            throw new AccessDeniedException("The friend request is not in a pending state.");
        }

        friendship.setStatus(FriendshipStatus.ACCEPTED);
        friendshipRepository.save(friendship);
    }

    public void declineFriendRequest(UUID friendshipId, User receiver) throws FriendshipNotFoundException, AccessDeniedException {
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new FriendshipNotFoundException(ERR_MSG_FRIENDSHIP_NOT_FOUND));

        if (!friendship.getReceiver().equals(receiver)) {
            throw new AccessDeniedException("Only the receiver can decline the friend request.");
        }

        if (!friendship.getStatus().equals(FriendshipStatus.PENDING)) {
            throw new AccessDeniedException("The friend request is not in a pending state.");
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
                .sorted(Comparator.comparing(userFriend -> userFriend.getUsername().toLowerCase()))
                .toList();
    }

    public void removeFriend(User user, UUID friendId) throws FriendshipNotFoundException {
        Friendship friendship = friendshipRepository.findByUsersAndStatus(user.getId(), friendId, FriendshipStatus.ACCEPTED)
                .orElseThrow(() -> new FriendshipNotFoundException(ERR_MSG_FRIENDSHIP_NOT_FOUND));

        friendshipRepository.delete(friendship);
    }

    public FriendshipStatus checkFriendshipStatus(UUID userId, UUID friendId) {
        Optional<Friendship> friendship = friendshipRepository.findByUsers(userId, friendId);
        return friendship.map(Friendship::getStatus).orElse(FriendshipStatus.NONE);
    }
}