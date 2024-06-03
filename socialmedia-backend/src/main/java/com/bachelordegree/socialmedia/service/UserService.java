package com.bachelordegree.socialmedia.service;

import com.bachelordegree.socialmedia.dto.UserProfileUpdateDTO;
import com.bachelordegree.socialmedia.exception.InvalidImageException;
import com.bachelordegree.socialmedia.exception.UserAlreadyExistsException;
import com.bachelordegree.socialmedia.model.Inventory;
import com.bachelordegree.socialmedia.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.bachelordegree.socialmedia.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static com.bachelordegree.socialmedia.exception.InvalidImageException.ERR_MSG_INVALID_IMAGE;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found!"));
    }

    public List<User> getAll() {
        return userRepository.findAll(Sort.by("username"));
    }

    public User getById(UUID id) throws UsernameNotFoundException{
        return userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found!"));
    }

    public List<User> findUsersByUsername(String username) {
        return userRepository.findByUsernameContainingIgnoreCase(username);
    }

    public User updateUserProfile(UUID userId, UserProfileUpdateDTO updateDTO) throws UsernameNotFoundException, UserAlreadyExistsException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with ID: " + userId));

        user.setName(updateDTO.getName());
        user.setPhoneNumber(updateDTO.getPhoneNumber());
        user.setDescription(updateDTO.getDescription());

        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public Inventory getUserInventory(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        return user.getInventory();
    }

    @Transactional
    public User updateAvatar(String username, String newAvatarUrl) throws InvalidImageException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        if (!user.getInventory().getProfilePictureUrls().contains(newAvatarUrl)) {
            throw new InvalidImageException(ERR_MSG_INVALID_IMAGE);
        }

        user.setAvatarUrl(newAvatarUrl);
        userRepository.save(user);
        return user;
    }

    @Transactional
    public User updateBackground(String username, String newBackgroundUrl) throws InvalidImageException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        if (!user.getInventory().getBackgroundPictureUrls().contains(newBackgroundUrl)) {
            throw new InvalidImageException(ERR_MSG_INVALID_IMAGE);
        }

        user.setBackgroundUrl(newBackgroundUrl);
        userRepository.save(user);
        return user;
    }
}