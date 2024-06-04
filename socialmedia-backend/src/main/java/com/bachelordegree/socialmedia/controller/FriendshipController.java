package com.bachelordegree.socialmedia.controller;

import com.bachelordegree.socialmedia.converter.FriendshipConverter;
import com.bachelordegree.socialmedia.converter.UserConverter;
import com.bachelordegree.socialmedia.dto.FriendshipDTO;
import com.bachelordegree.socialmedia.dto.UserDTO;
import com.bachelordegree.socialmedia.exception.FriendRequestException;
import com.bachelordegree.socialmedia.exception.FriendshipNotFoundException;
import com.bachelordegree.socialmedia.exception.RestException;
import com.bachelordegree.socialmedia.model.Friendship;
import com.bachelordegree.socialmedia.model.FriendshipStatus;
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

import java.nio.file.AccessDeniedException;
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
            User requester = userService.loadUserByUsername(requesterUsername);
            User receiver = userService.loadUserByUsername(receiverUsername);
            friendshipService.sendFriendRequest(requester, receiver);
        } catch (UsernameNotFoundException | FriendRequestException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @PostMapping("/accept/{friendshipId}")
    public void acceptFriendRequest(@PathVariable UUID friendshipId, Authentication authentication) {
        String receiverUsername = authentication.getName();
        try {
            User receiver = userService.loadUserByUsername(receiverUsername);
            friendshipService.acceptFriendRequest(friendshipId, receiver);
        } catch (UsernameNotFoundException | FriendshipNotFoundException | AccessDeniedException e) {
            throw new RestException(HttpStatus.NOT_FOUND,  e.getMessage());
        }
    }

    @PostMapping("/decline/{friendshipId}")
    public void declineFriendRequest(@PathVariable UUID friendshipId, Authentication authentication) {
        String receiverUsername = authentication.getName();
        try {
            User receiver = userService.loadUserByUsername(receiverUsername);
            friendshipService.declineFriendRequest(friendshipId, receiver);
        } catch (UsernameNotFoundException | FriendshipNotFoundException | AccessDeniedException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @GetMapping("/requests")
    public List<FriendshipDTO> getPendingFriendRequests(Authentication authentication) {
        String username = authentication.getName();
        try {
            User user = userService.loadUserByUsername(username);
            List<Friendship> friendRequests = friendshipService.listPendingFriendRequests(user);
            return friendRequests.stream()
                    .map(friendshipConverter::toDTO)
                    .toList();
        } catch (UsernameNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @GetMapping("/friends")
    public List<UserDTO> listFriends(Authentication authentication) {
        String username = authentication.getName();
        try {
            User user = userService.loadUserByUsername(username);
            List<User> friends = friendshipService.listFriends(user);
            return friends.stream()
                    .map(userConverter::toDTO)
                    .toList();
        } catch (UsernameNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND,  e.getMessage());
        }
    }

    @DeleteMapping("/friends/{friendId}")
    public void removeFriend(@PathVariable UUID friendId, Authentication authentication) {
        String username = authentication.getName();
        try {
            User user = userService.loadUserByUsername(username);
            friendshipService.removeFriend(user, friendId);
        } catch (FriendshipNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @GetMapping("/status/{friendId}")
    public FriendshipStatus checkFriendshipStatus(@PathVariable UUID friendId, Authentication authentication) {
        String username = authentication.getName();
        try {
            User user =  userService.loadUserByUsername(username);
            return friendshipService.checkFriendshipStatus(user.getId(), friendId);
        } catch (UsernameNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }
}