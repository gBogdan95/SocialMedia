package com.bachelordegree.socialmedia.controller;

import com.bachelordegree.socialmedia.converter.PostConverter;
import com.bachelordegree.socialmedia.dto.PostDTO;
import com.bachelordegree.socialmedia.exception.PostNotFoundException;
import com.bachelordegree.socialmedia.exception.RestException;
import com.bachelordegree.socialmedia.model.Post;
import com.bachelordegree.socialmedia.service.PostService;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
    public PostDTO createPost(@RequestBody PostDTO postDTO) {
        Post post = postConverter.toEntity(postDTO);
        post = postService.save(post);
        return postConverter.toDTO(post);
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