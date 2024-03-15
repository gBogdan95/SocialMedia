package com.bachelordegree.socialmedia.controller;

import com.bachelordegree.socialmedia.converter.UserConverter;
import com.bachelordegree.socialmedia.dto.ReplyDTO;
import com.bachelordegree.socialmedia.dto.UserDTO;
import com.bachelordegree.socialmedia.exception.ReplyNotFoundException;
import com.bachelordegree.socialmedia.exception.RestException;
import com.bachelordegree.socialmedia.service.UserService;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
}
