package com.bachelordegree.socialmedia.controller;

import com.bachelordegree.socialmedia.dto.LoginResponseDTO;
import com.bachelordegree.socialmedia.dto.UsernameUpdateRequestDTO;
import com.bachelordegree.socialmedia.exception.RestException;
import com.bachelordegree.socialmedia.exception.UserAlreadyExistsException;
import com.bachelordegree.socialmedia.service.SettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
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
}
