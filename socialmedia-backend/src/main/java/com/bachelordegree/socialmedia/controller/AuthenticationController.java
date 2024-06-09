package com.bachelordegree.socialmedia.controller;

import com.bachelordegree.socialmedia.dto.LoginDTO;
import com.bachelordegree.socialmedia.dto.LoginResponseDTO;
import com.bachelordegree.socialmedia.dto.RegistrationDTO;
import com.bachelordegree.socialmedia.dto.RegistrationResponseDTO;
import com.bachelordegree.socialmedia.exception.CustomAuthenticationException;
import com.bachelordegree.socialmedia.exception.RestException;
import com.bachelordegree.socialmedia.exception.RoleNotFoundException;
import com.bachelordegree.socialmedia.exception.UserAlreadyExistsException;
import com.bachelordegree.socialmedia.model.User;
import com.bachelordegree.socialmedia.service.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;


import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthenticationController {

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/register")
    public RegistrationResponseDTO registerUser(@RequestBody @Valid RegistrationDTO registrationDTO) {
        try {
            User user = authenticationService.registerUser(
                    registrationDTO.getUsername(), registrationDTO.getPassword(), registrationDTO.getEmail());
            return new RegistrationResponseDTO(user.getId(), user.getUsername(), user.getEmail());
        } catch (RoleNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (UserAlreadyExistsException e) {
            throw new RestException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @PostMapping("/login")
    public LoginResponseDTO loginUser(@RequestBody @Valid LoginDTO loginDTO) {
        try {
            return authenticationService.loginUser(loginDTO.getUsername(), loginDTO.getPassword());
        } catch (CustomAuthenticationException e) {
            throw new RestException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
}