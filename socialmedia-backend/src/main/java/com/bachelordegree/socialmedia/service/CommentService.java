package com.bachelordegree.socialmedia.service;

import com.bachelordegree.socialmedia.exception.CommentNotFoundException;
import com.bachelordegree.socialmedia.exception.PostNotFoundException;
import com.bachelordegree.socialmedia.model.Comment;
import com.bachelordegree.socialmedia.model.Post;
import com.bachelordegree.socialmedia.repository.CommentRepository;
import com.bachelordegree.socialmedia.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static com.bachelordegree.socialmedia.exception.CommentNotFoundException.ERR_MSG_COMMENT_NOT_FOUND;
import static com.bachelordegree.socialmedia.exception.PostNotFoundException.ERR_MSG_POST_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    public List<Comment> getAll() {
        return commentRepository.findAll();
    }

    public Comment getById(UUID id) throws CommentNotFoundException {
        return commentRepository.findById(id)
                .orElseThrow(() -> new CommentNotFoundException(ERR_MSG_COMMENT_NOT_FOUND));
    }

    public List<Comment> getCommentsByPostId(UUID postId) {
        return commentRepository.findAllByPostId(postId);
    }

    public Comment save(UUID postId, Comment comment) throws PostNotFoundException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException(ERR_MSG_POST_NOT_FOUND));

        comment.setPost(post);
        return commentRepository.save(comment);
    }


    public Comment update(UUID id, Comment commentUpdate) throws CommentNotFoundException {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new CommentNotFoundException(ERR_MSG_COMMENT_NOT_FOUND));

        comment.setText(commentUpdate.getText());
        return commentRepository.save(comment);
    }

    public void delete(UUID id) throws CommentNotFoundException {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new CommentNotFoundException(ERR_MSG_COMMENT_NOT_FOUND));

        commentRepository.delete(comment);
    }

    @Transactional
    public void likeComment(UUID id) throws CommentNotFoundException {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new CommentNotFoundException(ERR_MSG_COMMENT_NOT_FOUND));

        comment.setLikes(comment.getLikes() + 1);

        commentRepository.save(comment);
    }

    @Transactional
    public void unlikeComment(UUID id) throws CommentNotFoundException {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new CommentNotFoundException(ERR_MSG_COMMENT_NOT_FOUND));

        int currentLikes = comment.getLikes();
        comment.setLikes(Math.max(0, currentLikes - 1));

        commentRepository.save(comment);
    }

    @Transactional
    public void dislikeComment(UUID id) throws CommentNotFoundException {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new CommentNotFoundException(ERR_MSG_COMMENT_NOT_FOUND));

        comment.setDislikes(comment.getDislikes() + 1);

        commentRepository.save(comment);
    }

    @Transactional
    public void removeDislikeComment(UUID id) throws CommentNotFoundException {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new CommentNotFoundException(ERR_MSG_COMMENT_NOT_FOUND));

        int currentDislikes = comment.getDislikes();
        comment.setDislikes(Math.max(0, currentDislikes - 1));

        commentRepository.save(comment);
    }
}