package com.bachelordegree.socialmedia.controller;

import com.bachelordegree.socialmedia.dto.ConversationOverviewDTO;
import com.bachelordegree.socialmedia.exception.RestException;
import com.bachelordegree.socialmedia.model.User;
import com.bachelordegree.socialmedia.service.ConversationService;
import com.bachelordegree.socialmedia.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/user/conversations")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ConversationController {
    private final ConversationService conversationService;
    private final UserService userService;

    @GetMapping()
    public List<ConversationOverviewDTO> getAllUserConversations(Authentication authentication) {
        String username = authentication.getName();
        try {
            User currentUser = userService.loadUserByUsername(username);
            return conversationService.getAllConversationsForUser(currentUser);
        } catch (UsernameNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }
}