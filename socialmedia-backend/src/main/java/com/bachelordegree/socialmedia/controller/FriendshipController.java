package com.bachelordegree.socialmedia.controller;

import com.bachelordegree.socialmedia.converter.FriendshipConverter;
import com.bachelordegree.socialmedia.converter.UserConverter;
import com.bachelordegree.socialmedia.dto.FriendshipDTO;
import com.bachelordegree.socialmedia.dto.UserDTO;
import com.bachelordegree.socialmedia.exception.RestException;
import com.bachelordegree.socialmedia.model.Friendship;
import com.bachelordegree.socialmedia.model.User;
import com.bachelordegree.socialmedia.service.FriendshipService;
import com.bachelordegree.socialmedia.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/user/friendships")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class FriendshipController {

    private final FriendshipService friendshipService;
    private final UserService userService;
    private final UserConverter userConverter;

    @Autowired
    private FriendshipConverter friendshipConverter;

    @PostMapping("/send/{receiverUsername}")
    public void sendFriendRequest(@PathVariable String receiverUsername, Authentication authentication) {
        String requesterUsername = authentication.getName();
        try {
            User requester = (User) userService.loadUserByUsername(requesterUsername);
            User receiver = (User) userService.loadUserByUsername(receiverUsername);

            friendshipService.sendFriendRequest(requester, receiver);
        } catch (UsernameNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, "User not found: " + e.getMessage());
        } catch (IllegalStateException | IllegalArgumentException e) {
            throw new RestException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @PostMapping("/accept/{friendshipId}")
    public void acceptFriendRequest(@PathVariable UUID friendshipId, Authentication authentication) {
        String receiverUsername = authentication.getName();
        try {
            User receiver = (User) userService.loadUserByUsername(receiverUsername);

            friendshipService.acceptFriendRequest(friendshipId, receiver);
        } catch (UsernameNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, "User not found: " + e.getMessage());
        } catch (EntityNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, "Friend request not found.");
        } catch (IllegalStateException e) {
            throw new RestException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @PostMapping("/decline/{friendshipId}")
    public void declineFriendRequest(@PathVariable UUID friendshipId, Authentication authentication) {
        String receiverUsername = authentication.getName();
        try {
            User receiver = (User) userService.loadUserByUsername(receiverUsername);

            friendshipService.declineFriendRequest(friendshipId, receiver);
        } catch (UsernameNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, "User not found: " + e.getMessage());
        } catch (EntityNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, "Friend request not found.");
        } catch (IllegalStateException e) {
            throw new RestException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @GetMapping("/requests")
    public List<FriendshipDTO> getPendingFriendRequests(Authentication authentication) {
        String username = authentication.getName();
        try {
            User user = (User) userService.loadUserByUsername(username);
            List<Friendship> friendRequests = friendshipService.listPendingFriendRequests(user);
            return friendRequests.stream()
                    .map(friendshipConverter::toDTO)
                    .toList();
        } catch (UsernameNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, "User not found: " + e.getMessage());
        }
    }

    @GetMapping("/friends")
    public List<UserDTO> listFriends(Authentication authentication) {
        String username = authentication.getName();
        try {
            User user = (User) userService.loadUserByUsername(username);
            List<User> friends = friendshipService.listFriends(user);
            return friends.stream()
                    .map(userConverter::toDTO)
                    .toList();
        } catch (UsernameNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, "User not found: " + e.getMessage());
        }
    }

    @DeleteMapping("/friends/{friendId}")
    public void removeFriend(@PathVariable UUID friendId, Authentication authentication) {
        String username = authentication.getName();
        try {
            User user = (User) userService.loadUserByUsername(username);
            friendshipService.removeFriend(user, friendId);
        } catch (EntityNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, "Friendship not found.");
        }
    }
}