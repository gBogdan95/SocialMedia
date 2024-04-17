package com.bachelordegree.socialmedia.controller;

import com.bachelordegree.socialmedia.dto.*;
import com.bachelordegree.socialmedia.exception.RestException;
import com.bachelordegree.socialmedia.exception.UserAlreadyExistsException;
import com.bachelordegree.socialmedia.service.SettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/user/settings")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class SettingsController {

    @Autowired
    private SettingsService settingsService;

    @PutMapping("/update-username/{userId}")
    public LoginResponseDTO updateUsername(@PathVariable UUID userId,
                                           @Valid @RequestBody UsernameUpdateRequestDTO request) {
        try {
            return settingsService.updateUsername(userId, request.getNewUsername(), request.getPassword());
        } catch (UsernameNotFoundException | UserAlreadyExistsException e) {
            throw new RestException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (AuthenticationException e) {
            throw new RestException(HttpStatus.UNAUTHORIZED, "Invalid password");
        } catch (Exception e) {
            throw new RestException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while updating the username");
        }
    }

    @PutMapping("/update-password/{userId}")
    public LoginResponseDTO updatePassword(@PathVariable UUID userId,
                                           @Valid @RequestBody PasswordUpdateRequestDTO request) {
        try {
            return settingsService.updatePassword(userId, request.getCurrentPassword(), request.getNewPassword());
        } catch (UsernameNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, "User not found");
        } catch (AuthenticationException e) {
            throw new RestException(HttpStatus.UNAUTHORIZED, "Invalid current password");
        } catch (Exception e) {
            throw new RestException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while updating the password");
        }
    }

    @PutMapping("/update-email/{userId}")
    public LoginResponseDTO updateEmail(@PathVariable UUID userId,
                                        @Valid @RequestBody EmailUpdateRequestDTO request) {
        try {
            return settingsService.updateEmail(userId, request.getPassword(), request.getNewEmail());
        } catch (UsernameNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, "User not found");
        } catch (AuthenticationException e) {
            throw new RestException(HttpStatus.UNAUTHORIZED, "Invalid password");
        } catch (Exception e) {
            throw new RestException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while updating the email");
        }
    }

    @PatchMapping("/update-friend-request-setting/{userId}")
    public UserDTO updateFriendRequestSetting(@PathVariable UUID userId,
                                              @RequestBody Map<String, Boolean> updates,
                                              Authentication authentication) {
        String currentUsername = authentication.getName();
        try {
            if (!updates.containsKey("isAllowingFriendRequests")) {
                throw new IllegalArgumentException("Required key 'isAllowingFriendRequests' is missing");
            }

            boolean isAllowing = updates.get("isAllowingFriendRequests");
            return settingsService.updateFriendRequestSetting(userId, isAllowing, currentUsername);
        } catch (UsernameNotFoundException | AccessDeniedException e) {
            throw new RestException(HttpStatus.FORBIDDEN, e.getMessage());
        } catch (IllegalArgumentException e) {
            throw new RestException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            throw new RestException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while updating the friend request setting");
        }
    }

    @PatchMapping("/update-message-permission-setting/{userId}")
    public UserDTO updateMessagePermissionSetting(@PathVariable UUID userId,
                                                  @RequestBody Map<String, Boolean> updates,
                                                  Authentication authentication) {
        String currentUsername = authentication.getName();
        try {
            if (!updates.containsKey("isAllowingMessagesFromNonFriends")) {
                throw new IllegalArgumentException("Required key 'isAllowingMessagesFromNonFriends' is missing");
            }

            boolean isAllowing = updates.get("isAllowingMessagesFromNonFriends");
            return settingsService.updateMessagePermissionSetting(userId, isAllowing, currentUsername);
        } catch (UsernameNotFoundException | AccessDeniedException e) {
            throw new RestException(HttpStatus.FORBIDDEN, e.getMessage());
        } catch (IllegalArgumentException e) {
            throw new RestException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            throw new RestException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while updating the message permission setting");
        }
    }

}