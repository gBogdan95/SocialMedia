package com.bachelordegree.socialmedia.controller;

import com.bachelordegree.socialmedia.converter.CommentConverter;
import com.bachelordegree.socialmedia.converter.PostConverter;
import com.bachelordegree.socialmedia.dto.CommentDTO;
import com.bachelordegree.socialmedia.dto.CreateOrUpdateCommentDTO;
import com.bachelordegree.socialmedia.exception.*;
import com.bachelordegree.socialmedia.model.Comment;
import com.bachelordegree.socialmedia.service.CommentService;
import com.bachelordegree.socialmedia.service.PostService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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

    @GetMapping("/{id}")
    public CommentDTO getById(@PathVariable @NotNull UUID id, Authentication authentication) {
        try {
            String currentUsername = authentication.getName();
            Comment comment = commentService.getById(id);
            return commentConverter.toDTO(comment, currentUsername);
        } catch (CommentNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @GetMapping("/by-post/{postId}")
    public List<CommentDTO> getByPostId(@PathVariable UUID postId, Authentication authentication) {
        String currentUsername = authentication.getName();
        List<Comment> comments = commentService.getCommentsByPostId(postId);
        return comments.stream()
                .map(comment -> commentConverter.toDTO(comment, currentUsername))
                .toList();
    }

    @PostMapping("/{postId}")
    public CommentDTO create(@PathVariable UUID postId, @Valid @RequestBody CreateOrUpdateCommentDTO commentDTO, Authentication authentication) {
        try {
            String username = authentication.getName();
            Comment comment = commentConverter.toEntity(commentDTO);
            comment = commentService.save(comment, postId, username);
            return commentConverter.toDTO(comment);
        } catch (UsernameNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, "User not found: " + e.getMessage());
        } catch (PostNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @PutMapping("/{commentId}")
    public CommentDTO update(@PathVariable UUID commentId, @Valid @RequestBody CreateOrUpdateCommentDTO commentDTO, Authentication authentication) {
        try {
            String username = authentication.getName();
            Comment commentToUpdate = commentConverter.toEntity(commentDTO);
            Comment updatedComment = commentService.update(commentId, commentToUpdate, username);
            return commentConverter.toDTO(updatedComment);
        } catch (CommentNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (AccessDeniedException e) {
            throw new RestException(HttpStatus.FORBIDDEN, e.getMessage());
        }
    }

    @DeleteMapping("/{commentId}")
    public void delete(@PathVariable @NotNull UUID commentId, Authentication authentication) {
        try {
            String username = authentication.getName();
            commentService.delete(commentId, username);
        } catch (CommentNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (AccessDeniedException e) {
            throw new RestException(HttpStatus.FORBIDDEN, e.getMessage());
        }
    }

    @PostMapping("/{id}/like")
    public CommentDTO like(@PathVariable UUID id, Authentication authentication) {
        try {
            String username = authentication.getName();
            commentService.likeComment(id, username);
            Comment comment = commentService.getById(id);
            return commentConverter.toDTO(comment);
        } catch (CommentNotFoundException | AlreadyLikedException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @PostMapping("/{id}/remove-like")
    public CommentDTO unlike(@PathVariable UUID id, Authentication authentication) {
        try {
            String username = authentication.getName();
            commentService.unlikeComment(id, username);
            Comment comment = commentService.getById(id);
            return commentConverter.toDTO(comment);
        } catch (CommentNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (NotLikedException e) {
            throw new RestException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
}