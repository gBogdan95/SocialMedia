package com.bachelordegree.socialmedia.converter;

import com.bachelordegree.socialmedia.dto.CommentDTO;

import com.bachelordegree.socialmedia.dto.CreateOrUpdateCommentDTO;
import com.bachelordegree.socialmedia.model.Comment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CommentConverter {
    @Autowired
    private UserConverter userConverter;

    public Comment toEntity(CreateOrUpdateCommentDTO commentDTO) {
        Comment comment = new Comment();
        comment.setText(commentDTO.getText());
        return comment;
    }

    public CommentDTO toDTO(Comment comment) {
        CommentDTO commentDTO = new CommentDTO();
        commentDTO.setId(comment.getId());
        commentDTO.setText(comment.getText());
        commentDTO.setLikes(comment.getLikes());

        if (comment.getUser() != null) {
            commentDTO.setUser(userConverter.toDTO(comment.getUser()));
        }

        return commentDTO;
    }

    public CommentDTO toDTO(Comment comment, String currentUsername) {
        CommentDTO commentDTO = new CommentDTO();
        commentDTO.setId(comment.getId());
        commentDTO.setText(comment.getText());
        commentDTO.setLikes(comment.getLikes());

        if (comment.getUser() != null) {
            commentDTO.setUser(userConverter.toDTO(comment.getUser()));
        }

        boolean isLiked = comment.getLikedByUsers().stream()
                .anyMatch(user -> user.getUsername().equals(currentUsername));
        commentDTO.setLiked(isLiked);

        return commentDTO;
    }
}
