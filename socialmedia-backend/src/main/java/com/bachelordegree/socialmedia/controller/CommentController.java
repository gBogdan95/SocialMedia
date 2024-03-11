package com.bachelordegree.socialmedia.controller;

import com.bachelordegree.socialmedia.converter.CommentConverter;
import com.bachelordegree.socialmedia.converter.PostConverter;
import com.bachelordegree.socialmedia.dto.CommentDTO;
import com.bachelordegree.socialmedia.exception.AlreadyLikedException;
import com.bachelordegree.socialmedia.exception.CommentNotFoundException;
import com.bachelordegree.socialmedia.exception.PostNotFoundException;
import com.bachelordegree.socialmedia.exception.RestException;
import com.bachelordegree.socialmedia.model.Comment;
import com.bachelordegree.socialmedia.model.Post;
import com.bachelordegree.socialmedia.service.CommentService;
import com.bachelordegree.socialmedia.service.PostService;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("user/comments")
@CrossOrigin(origins = "http://localhost:3000")
public class CommentController {

    private final CommentService commentService;
    private final CommentConverter commentConverter;
    private final PostService postService;
    private final PostConverter postConverter;

    @GetMapping
    public List<CommentDTO> getAll() {
        return commentService.getAll().stream()
                .map(commentConverter::toDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public CommentDTO getById(@PathVariable @NotNull UUID id) {
        try {
            Comment comment = commentService.getById(id);
            return commentConverter.toDTO(comment);
        } catch (CommentNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @GetMapping("/by-post/{postId}")
    public List<CommentDTO> getCommentsByPostId(@PathVariable UUID postId) {
        List<Comment> comments = commentService.getCommentsByPostId(postId);
        return comments.stream()
                .map(commentConverter::toDTO)
                .toList();
    }

    @PostMapping("/{postId}")
    public CommentDTO createComment(@PathVariable UUID postId, @RequestBody CommentDTO commentDTO) {
        try {
            Comment comment = commentConverter.toEntity(commentDTO);
            comment = commentService.save(postId, comment);
            return commentConverter.toDTO(comment);
        } catch (PostNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public CommentDTO update(@PathVariable @NotNull UUID id, @RequestBody CommentDTO commentDTO) {
        try {
            Comment commentToUpdate = commentConverter.toEntity(commentDTO);
            Comment updatedComment = commentService.update(id, commentToUpdate);
            return commentConverter.toDTO(updatedComment);
        } catch (CommentNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable @NotNull UUID id) {
        try {
            commentService.delete(id);
        } catch (CommentNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @PostMapping("/{id}/like")
    public CommentDTO like(@PathVariable UUID id) {
        try {
            commentService.likeComment(id);
            Comment comment = commentService.getById(id);
            return commentConverter.toDTO(comment);
        } catch (CommentNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }


    @PostMapping("/{id}/remove-like")
    public CommentDTO unlike(@PathVariable UUID id) {
        try {
            commentService.unlikeComment(id);
            Comment comment = commentService.getById(id);
            return commentConverter.toDTO(comment);
        } catch (CommentNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }
}