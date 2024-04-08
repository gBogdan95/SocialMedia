package com.bachelordegree.socialmedia.controller;

import com.bachelordegree.socialmedia.dto.ConversationOverviewDTO;
import com.bachelordegree.socialmedia.dto.MessageContentDTO;
import com.bachelordegree.socialmedia.dto.MessageDTO;
import com.bachelordegree.socialmedia.exception.RestException;
import com.bachelordegree.socialmedia.model.User;
import com.bachelordegree.socialmedia.service.MessageService;
import com.bachelordegree.socialmedia.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user/messages")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final UserService userService;

    @PostMapping("/send/{receiverUsername}")
    public MessageDTO sendMessage(@PathVariable String receiverUsername, @RequestBody MessageContentDTO messageContentDTO, Authentication authentication) {
        try {
            String senderUsername = authentication.getName();
            User sender = userService.loadUserByUsername(senderUsername);
            User receiver = userService.loadUserByUsername(receiverUsername);

            return messageService.sendMessage(sender, receiver, messageContentDTO);
        } catch (UsernameNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, "User not found: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            throw new RestException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @GetMapping("/{otherUsername}")
    public List<MessageDTO> getMessagesBetweenUsers(@PathVariable String otherUsername, Authentication authentication) {
        try {
            String callerUsername = authentication.getName();
            User caller = userService.loadUserByUsername(callerUsername);
            User otherUser = userService.loadUserByUsername(otherUsername);

            return messageService.getMessagesBetweenUsers(caller, otherUser);
        } catch (UsernameNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, "User not found: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            throw new RestException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
}