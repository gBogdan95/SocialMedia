package com.bachelordegree.socialmedia.controller;

import com.bachelordegree.socialmedia.dto.*;
import com.bachelordegree.socialmedia.exception.CustomAuthenticationException;
import com.bachelordegree.socialmedia.exception.RestException;
import com.bachelordegree.socialmedia.exception.UserAlreadyExistsException;
import com.bachelordegree.socialmedia.service.SettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/user/settings")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class SettingsController {

    @Autowired
    private SettingsService settingsService;

    @PutMapping("/update-username/{userId}")
    public LoginResponseDTO updateUsername(@PathVariable UUID userId, @Valid @RequestBody UsernameUpdateRequestDTO request) {
        try {
            return settingsService.updateUsername(userId, request.getNewUsername(), request.getPassword());
        } catch (UsernameNotFoundException | UserAlreadyExistsException e) {
            throw new RestException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (CustomAuthenticationException e) {
            throw new RestException(HttpStatus.UNAUTHORIZED, e.getMessage());
        }
    }

    @PutMapping("/update-password/{userId}")
    public LoginResponseDTO updatePassword(@PathVariable UUID userId, @Valid @RequestBody PasswordUpdateRequestDTO request) {
        try {
            return settingsService.updatePassword(userId, request.getCurrentPassword(), request.getNewPassword());
        } catch (UsernameNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (CustomAuthenticationException e) {
            throw new RestException(HttpStatus.UNAUTHORIZED, e.getMessage());
        }
    }

    @PutMapping("/update-email/{userId}")
    public LoginResponseDTO updateEmail(@PathVariable UUID userId, @Valid @RequestBody EmailUpdateRequestDTO request) {
        try {
            return settingsService.updateEmail(userId, request.getPassword(), request.getNewEmail());
        } catch (UsernameNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (CustomAuthenticationException e) {
            throw new RestException(HttpStatus.UNAUTHORIZED, e.getMessage());
        }
    }

    @PatchMapping("/update-friend-request-setting")
    public UserDTO updateFriendRequestSetting(@RequestBody Boolean isAllowingFriendRequests, Authentication authentication) {
        String currentUsername = authentication.getName();
        try {
            return settingsService.updateFriendRequestSetting(isAllowingFriendRequests, currentUsername);
        } catch (UsernameNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (AccessDeniedException e) {
            throw new RestException(HttpStatus.UNAUTHORIZED, e.getMessage());
        }
    }

    @PatchMapping("/update-message-permission-setting")
    public UserDTO updateMessagePermissionSetting(@RequestBody Boolean isAllowingMessagesFromNonFriends, Authentication authentication) {
        String currentUsername = authentication.getName();
        try {
            return settingsService.updateMessagePermissionSetting(isAllowingMessagesFromNonFriends, currentUsername);
        } catch (UsernameNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (AccessDeniedException e) {
            throw new RestException(HttpStatus.UNAUTHORIZED, e.getMessage());
        }
    }
}