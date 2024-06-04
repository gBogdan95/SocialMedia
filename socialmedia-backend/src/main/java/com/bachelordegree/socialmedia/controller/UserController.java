package com.bachelordegree.socialmedia.controller;

import com.bachelordegree.socialmedia.converter.InventoryConverter;
import com.bachelordegree.socialmedia.converter.UserConverter;
import com.bachelordegree.socialmedia.dto.*;
import com.bachelordegree.socialmedia.exception.InvalidImageException;
import com.bachelordegree.socialmedia.exception.RestException;
import com.bachelordegree.socialmedia.exception.UserAlreadyExistsException;
import com.bachelordegree.socialmedia.model.Inventory;
import com.bachelordegree.socialmedia.model.User;
import com.bachelordegree.socialmedia.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;
    private final UserConverter userConverter;
    private final InventoryConverter inventoryConverter;

    @GetMapping
    public List<UserDTO> getAll() {
        return userService.getAll().stream()
                .map(userConverter::toDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public UserDTO getById(@PathVariable @NotNull UUID id) {
        try {
            var user = userService.getById(id);
            return userConverter.toDTO(user);
        } catch (UsernameNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @PostMapping("/search")
    public List<UserDTO> searchUsers(@RequestBody SearchDTO searchDTO) {
        List<User> users = userService.findUsersByUsername(searchDTO.getSearch());
        return users.stream()
                .map(userConverter::toDTO)
                .toList();
    }

    @PutMapping("update-profile")
    public UserDTO updateProfile(@Valid @RequestBody UserProfileUpdateDTO updateDTO, Authentication authentication) {
        String username = authentication.getName();
        try {
            User updatedUser = userService.updateUserProfile(username, updateDTO);
            return userConverter.toDTO(updatedUser);
        } catch (UsernameNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @GetMapping("/inventory")
    public InventoryDTO getUserInventory(Authentication authentication) {
        try {
            Inventory inventory = userService.getUserInventory(authentication);
            return inventoryConverter.toDTO(inventory);
        } catch (UsernameNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @PutMapping("/update-avatar")
    public UserDTO updateAvatar(@RequestBody @Valid AvatarUpdateDTO avatarUpdateDTO, Authentication authentication) {
        String username = authentication.getName();
        try {
            User updatedUser = userService.updateAvatar(username, avatarUpdateDTO.getNewAvatarUrl());
            return userConverter.toDTO(updatedUser);
        } catch (InvalidImageException e) {
            throw new RestException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @PutMapping("/update-background")
    public UserDTO updateBackground(@RequestBody @Valid BackgroundUpdateDTO backgroundUpdateDTO, Authentication authentication) {
        String username = authentication.getName();
        try {
            User updatedUser = userService.updateBackground(username, backgroundUpdateDTO.getNewBackgroundUrl());
            return userConverter.toDTO(updatedUser);
        } catch (InvalidImageException e) {
            throw new RestException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
}