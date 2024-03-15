package com.bachelordegree.socialmedia.service;

import com.bachelordegree.socialmedia.exception.ReplyNotFoundException;
import com.bachelordegree.socialmedia.model.Reply;
import com.bachelordegree.socialmedia.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.bachelordegree.socialmedia.repository.UserRepository;

import java.util.List;
import java.util.UUID;

import static com.bachelordegree.socialmedia.exception.ReplyNotFoundException.ERR_MSG_REPLY_NOT_FOUND;

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
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("msg: User not found."));
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public User getById(UUID id) throws UsernameNotFoundException{
        return userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found!"));
    }
}
