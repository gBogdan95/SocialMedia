package com.bachelordegree.socialmedia.controller;

import com.bachelordegree.socialmedia.converter.PostConverter;
import com.bachelordegree.socialmedia.dto.PostDTO;
import com.bachelordegree.socialmedia.exception.PostNotFoundException;
import com.bachelordegree.socialmedia.exception.RestException;
import com.bachelordegree.socialmedia.model.Post;
import com.bachelordegree.socialmedia.model.User;
import com.bachelordegree.socialmedia.repository.UserRepository;
import com.bachelordegree.socialmedia.service.PostService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user/posts")
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {

    private final PostService postService;
    private final PostConverter postConverter;
    private final UserRepository userRepository;

    @GetMapping
    public List<PostDTO> getAll() {
        return postService.getAll().stream()
                .map(postConverter::toDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public PostDTO getById(@PathVariable @NotNull UUID id) {
        try {
            Post post = postService.getById(id);
            return postConverter.toDTO(post);
        } catch (PostNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @PostMapping
    public PostDTO createPost(@Valid @RequestBody PostDTO postDTO, Authentication authentication) {
        try {
            String username = authentication.getName();
            Post post = postConverter.toEntity(postDTO);
            post = postService.save(post, username);
            return postConverter.toDTO(post);
        } catch (UsernameNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, "User not found: " + e.getMessage());
        } catch (Exception e) {
            throw new RestException(HttpStatus.INTERNAL_SERVER_ERROR, "Error creating post: " + e.getMessage());
        }
    }


    @PutMapping("/{id}")
    public PostDTO update(@PathVariable @NotNull UUID id, @RequestBody PostDTO postDTO) {
        try {
            Post postToUpdate = postConverter.toEntity(postDTO);
            Post updatedPost = postService.update(id, postToUpdate);
            return postConverter.toDTO(updatedPost);
        } catch (PostNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable @NotNull UUID id) {
        try {
            postService.delete(id);
        } catch (PostNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @PostMapping("/{id}/like")
    public PostDTO like(@PathVariable UUID id) {
        try {
            postService.likePost(id);
            Post post = postService.getById(id);
            return postConverter.toDTO(post);
        } catch (PostNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @PostMapping("/{id}/remove-like")
    public PostDTO unlike(@PathVariable UUID id) {
        try {
            postService.unlikePost(id);
            Post post = postService.getById(id);
            return postConverter.toDTO(post);
        } catch (PostNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }
}