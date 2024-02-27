package com.bachelordegree.socialmedia.converter;

import com.bachelordegree.socialmedia.dto.CommentDTO;

import com.bachelordegree.socialmedia.model.Comment;
import org.springframework.stereotype.Component;

@Component
public class CommentConverter {

    public Comment toEntity(CommentDTO commentDTO) {
        Comment comment = new Comment();
        comment.setText(commentDTO.getText());
        comment.setLikes(commentDTO.getLikes());
        comment.setDislikes(commentDTO.getDislikes());

        return comment;
    }

    public CommentDTO toDTO(Comment comment) {
        CommentDTO commentDTO = new CommentDTO();
        commentDTO.setId(comment.getId());
        commentDTO.setText(comment.getText());
        commentDTO.setLikes(comment.getLikes());
        commentDTO.setDislikes(comment.getDislikes());

        return commentDTO;
    }
}
