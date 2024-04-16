package com.bachelordegree.socialmedia.service;

import com.bachelordegree.socialmedia.converter.UserConverter;
import com.bachelordegree.socialmedia.dto.LoginResponseDTO;
import com.bachelordegree.socialmedia.dto.UserDTO;
import com.bachelordegree.socialmedia.exception.UserAlreadyExistsException;
import com.bachelordegree.socialmedia.model.User;
import com.bachelordegree.socialmedia.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

import static com.bachelordegree.socialmedia.exception.UserAlreadyExistsException.ERR_MSG_USER_ALREADY_EXISTS;

@Service
public class SettingsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserConverter userConverter;

    public LoginResponseDTO updateUsername(UUID userId, String newUsername, String password) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with ID: " + userId));

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), password)
        );

        if (userRepository.findByUsername(newUsername).isPresent()) {
            throw new UserAlreadyExistsException(ERR_MSG_USER_ALREADY_EXISTS);
        }

        user.setUsername(newUsername);
        User updatedUser = userRepository.save(user);

        String newToken = tokenService.generateJwt(authentication);

        UserDTO userDTO = userConverter.toDTO(updatedUser);

        return new LoginResponseDTO(userDTO, newToken);
    }

    public LoginResponseDTO updatePassword(UUID userId, String currentPassword, String newPassword) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with ID: " + userId));

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), currentPassword)
        );

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        String newToken = tokenService.generateJwt(authentication);

        UserDTO userDTO = userConverter.toDTO(user);

        return new LoginResponseDTO(userDTO, newToken);
    }

    public LoginResponseDTO updateEmail(UUID userId, String password, String newEmail) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with ID: " + userId));

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), password)
        );

        user.setEmail(newEmail);
        User updatedUser = userRepository.save(user);

        String newToken = tokenService.generateJwt(authentication);

        UserDTO userDTO = userConverter.toDTO(updatedUser);

        return new LoginResponseDTO(userDTO, newToken);
    }

    public UserDTO updateFriendRequestSetting(UUID userId, boolean isAllowing, String username) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with ID: " + userId));

        if (!user.getUsername().equals(username)) {
            throw new AccessDeniedException("User not authorized to update this setting");
        }

        user.setAllowingFriendRequests(isAllowing);
        User updatedUser = userRepository.save(user);

        return userConverter.toDTO(updatedUser);
    }
}