package com.bachelordegree.socialmedia.service;

import com.bachelordegree.socialmedia.converter.UserConverter;
import com.bachelordegree.socialmedia.dto.LoginResponseDTO;
import com.bachelordegree.socialmedia.dto.UserDTO;
import com.bachelordegree.socialmedia.exception.CustomAuthenticationException;
import com.bachelordegree.socialmedia.exception.UserAlreadyExistsException;
import com.bachelordegree.socialmedia.model.Inventory;
import com.bachelordegree.socialmedia.model.Role;
import com.bachelordegree.socialmedia.model.User;
import com.bachelordegree.socialmedia.repository.RoleRepository;
import com.bachelordegree.socialmedia.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

import static com.bachelordegree.socialmedia.exception.CustomAuthenticationException.ERR_MSG_LOGIN_FAILED;
import static com.bachelordegree.socialmedia.exception.UserAlreadyExistsException.ERR_MSG_USER_ALREADY_EXISTS;

@Service
@Transactional
public class AuthenticationService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserConverter userConverter;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @Transactional
    public User registerUser(String username, String password, String email) throws UserAlreadyExistsException {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new UserAlreadyExistsException(ERR_MSG_USER_ALREADY_EXISTS);
        }

        String encodedPassword = passwordEncoder.encode(password);
        Role userRole = roleRepository.findByAuthority("USER").orElseThrow(() -> new RuntimeException("Role not found"));

        Set<Role> authorities = new HashSet<>();
        authorities.add(userRole);

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(encodedPassword);
        newUser.setEmail(email);
        newUser.setAuthorities(authorities);

        Inventory newInventory = new Inventory();
        newUser.setInventory(newInventory);

        return userRepository.save(newUser);
    }

    public LoginResponseDTO loginUser(String username, String password) throws CustomAuthenticationException {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            String token = tokenService.generateJwt(auth);
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            UserDTO userDTO = userConverter.toDTO(user);
            return new LoginResponseDTO(userDTO, token);
        } catch (AuthenticationException e) {
            throw new CustomAuthenticationException(ERR_MSG_LOGIN_FAILED);
        }
    }
}