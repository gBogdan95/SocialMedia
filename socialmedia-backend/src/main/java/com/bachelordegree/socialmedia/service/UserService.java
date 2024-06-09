package com.bachelordegree.socialmedia.service;

import com.bachelordegree.socialmedia.dto.AvatarUpdateDTO;
import com.bachelordegree.socialmedia.dto.BackgroundUpdateDTO;
import com.bachelordegree.socialmedia.dto.UserProfileUpdateDTO;

import com.bachelordegree.socialmedia.model.Inventory;
import com.bachelordegree.socialmedia.model.User;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.bachelordegree.socialmedia.repository.UserRepository;

import java.util.List;
import java.util.UUID;

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
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found!"));
    }

    public List<User> getAll() {
        return userRepository.findAllByOrderByUsernameAsc();
    }

    public User getById(UUID id) throws UsernameNotFoundException{
        return userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found!"));
    }

    public List<User> findUsersByUsername(String username) {
        return userRepository.findByUsernameContainingIgnoreCase(username);
    }

    public User updateUserProfile(String username, UserProfileUpdateDTO updateDTO) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        user.setName(updateDTO.getName());
        user.setPhoneNumber(updateDTO.getPhoneNumber());
        user.setDescription(updateDTO.getDescription());

        return userRepository.save(user);
    }

    public Inventory getUserInventory(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        return user.getInventory();
    }

    public User updateAvatar(String username, AvatarUpdateDTO updateDTO) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));


        user.setAvatarUrl(updateDTO.getNewAvatarUrl());
        userRepository.save(user);
        return user;
    }

    public User updateBackground(String username, BackgroundUpdateDTO updateDTO) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));


        user.setBackgroundUrl(updateDTO.getNewBackgroundUrl());
        userRepository.save(user);
        return user;
    }
}