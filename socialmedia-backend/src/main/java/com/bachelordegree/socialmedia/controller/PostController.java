package com.bachelordegree.socialmedia.controller;

import com.bachelordegree.socialmedia.converter.PostConverter;
import com.bachelordegree.socialmedia.dto.CreateOrUpdatePostDTO;
import com.bachelordegree.socialmedia.dto.PostDTO;
import com.bachelordegree.socialmedia.exception.AlreadyLikedException;
import com.bachelordegree.socialmedia.exception.NotLikedException;
import com.bachelordegree.socialmedia.exception.PostNotFoundException;
import com.bachelordegree.socialmedia.exception.RestException;
import com.bachelordegree.socialmedia.model.Post;
import com.bachelordegree.socialmedia.service.PostService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user/posts")
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {

    private final PostService postService;
    private final PostConverter postConverter;

    @GetMapping
    public List<PostDTO> getAll(Authentication authentication) {
        String currentUsername = authentication.getName();

        return postService.getAll().stream()
                .map(post -> postConverter.toDTO(post, currentUsername))
                .toList();
    }

    @GetMapping("/{id}")
    public PostDTO getById(@PathVariable @NotNull UUID id, Authentication authentication) {
        try {
            String currentUsername = authentication.getName();
            Post post = postService.getById(id);
            return postConverter.toDTO(post, currentUsername);
        } catch (PostNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @GetMapping("/by-user/{id}")
    public List<PostDTO> getByUserId(@PathVariable UUID id, Authentication authentication) {
        try {
            List<Post> posts = postService.getAllPostsByUserId(id);
            String currentUsername = authentication.getName();
            return posts.stream()
                    .map(post -> postConverter.toDTO(post, currentUsername))
                    .toList();
        } catch (UsernameNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @PostMapping
    public PostDTO create(@Valid @RequestBody CreateOrUpdatePostDTO postDTO, Authentication authentication) {
        try {
            String username = authentication.getName();
            Post post = postConverter.toEntity(postDTO);
            post = postService.save(post, username);
            return postConverter.toDTO(post);
        } catch (UsernameNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, "User not found: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public PostDTO update(@PathVariable @NotNull UUID id, @RequestBody CreateOrUpdatePostDTO postDTO, Authentication authentication) {
        try {
            String username = authentication.getName();
            Post postToUpdate = postConverter.toEntity(postDTO);
            Post updatedPost = postService.update(id, postToUpdate, username);
            return postConverter.toDTO(updatedPost);
        } catch (PostNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (AccessDeniedException e) {
            throw new RestException(HttpStatus.FORBIDDEN, e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable @NotNull UUID id, Authentication authentication) {
        try {
            String username = authentication.getName();
            postService.delete(id, username);
        } catch (PostNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (AccessDeniedException e) {
            throw new RestException(HttpStatus.FORBIDDEN, e.getMessage());
        }
    }

    @PostMapping("/{id}/like")
    public PostDTO like(@PathVariable UUID id, Authentication authentication) {
        try {
            String username = authentication.getName();
            postService.likePost(id, username);
            Post post = postService.getById(id);
            return postConverter.toDTO(post);
        } catch (PostNotFoundException | AlreadyLikedException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @PostMapping("/{id}/remove-like")
    public PostDTO unlike(@PathVariable UUID id, Authentication authentication) {
        try {
            String username = authentication.getName();
            postService.unlikePost(id, username);
            Post post = postService.getById(id);
            return postConverter.toDTO(post);
        } catch (PostNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (NotLikedException e) {
            throw new RestException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
}