package com.bachelordegree.socialmedia.service;

import com.bachelordegree.socialmedia.dto.UserProfileUpdateDTO;
import com.bachelordegree.socialmedia.exception.ReplyNotFoundException;
import com.bachelordegree.socialmedia.exception.UserAlreadyExistsException;
import com.bachelordegree.socialmedia.model.Inventory;
import com.bachelordegree.socialmedia.model.Reply;
import com.bachelordegree.socialmedia.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.bachelordegree.socialmedia.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static com.bachelordegree.socialmedia.exception.ReplyNotFoundException.ERR_MSG_REPLY_NOT_FOUND;
import static com.bachelordegree.socialmedia.exception.UserAlreadyExistsException.ERR_MSG_USER_ALREADY_EXISTS;

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
        return userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("msg: User not found."));
    }

    public List<User> getAll() {
        return userRepository.findAll(Sort.by("username"));
    }

    public User getById(UUID id) throws UsernameNotFoundException{
        return userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found!"));
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
}
