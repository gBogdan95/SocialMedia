package com.bachelordegree.socialmedia.service;

import com.bachelordegree.socialmedia.exception.AlreadyLikedException;
import com.bachelordegree.socialmedia.exception.CommentNotFoundException;
import com.bachelordegree.socialmedia.exception.NotLikedException;
import com.bachelordegree.socialmedia.exception.PostNotFoundException;
import com.bachelordegree.socialmedia.model.Comment;
import com.bachelordegree.socialmedia.model.Post;
import com.bachelordegree.socialmedia.model.User;
import com.bachelordegree.socialmedia.repository.CommentRepository;
import com.bachelordegree.socialmedia.repository.PostRepository;
import com.bachelordegree.socialmedia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static com.bachelordegree.socialmedia.exception.AlreadyLikedException.ERR_MSG_COMMENT_ALREADY_LIKED;
import static com.bachelordegree.socialmedia.exception.AlreadyLikedException.ERR_MSG_POST_ALREADY_LIKED;
import static com.bachelordegree.socialmedia.exception.CommentNotFoundException.ERR_MSG_COMMENT_NOT_FOUND;
import static com.bachelordegree.socialmedia.exception.NotLikedException.ERR_MSG_COMMENT_NOT_LIKED;
import static com.bachelordegree.socialmedia.exception.NotLikedException.ERR_MSG_POST_NOT_LIKED;
import static com.bachelordegree.socialmedia.exception.PostNotFoundException.ERR_MSG_POST_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public Comment getById(UUID id) throws CommentNotFoundException {
        return commentRepository.findById(id)
                .orElseThrow(() -> new CommentNotFoundException(ERR_MSG_COMMENT_NOT_FOUND));
    }

    public List<Comment> getCommentsByPostId(UUID postId) {
        return commentRepository.findAllByPostIdOrderByCreatedAtAsc(postId);
    }

    public Comment save(Comment comment, UUID postId, String username) throws PostNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException(ERR_MSG_POST_NOT_FOUND));

        comment.setUser(user);
        comment.setPost(post);
        return commentRepository.save(comment);
    }

    public Comment update(UUID commentId, Comment commentUpdate, String username) throws CommentNotFoundException, AccessDeniedException {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException(ERR_MSG_COMMENT_NOT_FOUND));

        if (!comment.getUser().getUsername().equals(username)) {
            throw new AccessDeniedException("User does not have permission to update this comment");
        }

        comment.setText(commentUpdate.getText());
        return commentRepository.save(comment);
    }

    public void delete(UUID commentId, String username) throws CommentNotFoundException, AccessDeniedException {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException(ERR_MSG_COMMENT_NOT_FOUND));

        if (!comment.getUser().getUsername().equals(username)) {
            throw new AccessDeniedException("User does not have permission to delete this comment");
        }

        commentRepository.delete(comment);
    }

    @Transactional
    public void likeComment(UUID commentId, String username) throws CommentNotFoundException, AlreadyLikedException {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException(ERR_MSG_COMMENT_NOT_FOUND));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        boolean alreadyLiked = commentRepository.existsByCommentIdAndUserId(commentId, user.getId());
        if (alreadyLiked) {
            throw new AlreadyLikedException(ERR_MSG_COMMENT_ALREADY_LIKED);
        } else {
            comment.getLikedByUsers().add(user);
            comment.setLikes(comment.getLikes() + 1);
            commentRepository.save(comment);
        }
    }

    @Transactional
    public void unlikeComment(UUID commentId, String username) throws CommentNotFoundException, NotLikedException {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException(ERR_MSG_COMMENT_NOT_FOUND));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        boolean hasUserLikedComment = comment.getLikedByUsers().contains(user);
        if (!hasUserLikedComment) {
            throw new NotLikedException(ERR_MSG_COMMENT_NOT_LIKED);
        }

        comment.getLikedByUsers().remove(user);
        comment.setLikes(Math.max(0, comment.getLikes() - 1));
        commentRepository.save(comment);
    }
}