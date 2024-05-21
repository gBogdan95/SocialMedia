package com.bachelordegree.socialmedia.service;

import com.bachelordegree.socialmedia.dto.PostDTO;
import com.bachelordegree.socialmedia.exception.AlreadyLikedException;
import com.bachelordegree.socialmedia.exception.NotLikedException;
import com.bachelordegree.socialmedia.exception.PostNotFoundException;
import com.bachelordegree.socialmedia.model.Post;
import com.bachelordegree.socialmedia.model.User;
import com.bachelordegree.socialmedia.repository.PostRepository;
import com.bachelordegree.socialmedia.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;

import static com.bachelordegree.socialmedia.exception.AlreadyLikedException.ERR_MSG_POST_ALREADY_LIKED;
import static com.bachelordegree.socialmedia.exception.NotLikedException.ERR_MSG_POST_NOT_LIKED;
import static com.bachelordegree.socialmedia.exception.PostNotFoundException.ERR_MSG_POST_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    private final UserRepository userRepository;

    public List<Post> getAll() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    public Post getById(UUID id) throws PostNotFoundException {
        return postRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException(ERR_MSG_POST_NOT_FOUND));
    }

    public List<Post> getAllPostsByUserId(UUID id) throws UsernameNotFoundException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with ID: " + id));
        return postRepository.findAllByUserOrderByCreatedAtDesc(user);
    }

    public Post save(Post post, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        user.setCurrency(user.getCurrency() + 10);
        userRepository.save(user);

        post.setUser(user);
        return postRepository.save(post);
    }


    public Post update(UUID id, Post postUpdate, String username) throws PostNotFoundException, AccessDeniedException {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException(ERR_MSG_POST_NOT_FOUND));

        if (!post.getUser().getUsername().equals(username)) {
            throw new AccessDeniedException("User does not have permission to update this post");
        }

        post.setTitle((postUpdate.getTitle()));
        post.setText(postUpdate.getText());
        post.setImageUrl(postUpdate.getImageUrl());
        return postRepository.save(post);
    }

    public void delete(UUID id, String username) throws PostNotFoundException, AccessDeniedException {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException(ERR_MSG_POST_NOT_FOUND));

        if (!post.getUser().getUsername().equals(username)) {
            throw new AccessDeniedException("User does not have permission to delete this post");
        }

        postRepository.delete(post);
    }

    @Transactional
    public void likePost(UUID postId, String username) throws PostNotFoundException, AlreadyLikedException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException(ERR_MSG_POST_NOT_FOUND));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        boolean alreadyLiked = postRepository.existsByPostIdAndUserId(postId, user.getId());
        if (alreadyLiked) {
            throw new AlreadyLikedException(ERR_MSG_POST_ALREADY_LIKED);
        } else {
            post.getLikedByUsers().add(user);
            post.setLikes(post.getLikes() + 1);
            user.setCurrency(user.getCurrency() + 1);
            postRepository.save(post);
        }
    }

    @Transactional
    public void unlikePost(UUID postId, String username) throws PostNotFoundException, NotLikedException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException(ERR_MSG_POST_NOT_FOUND));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        boolean hasUserLikedPost = post.getLikedByUsers().contains(user);
        if (!hasUserLikedPost) {
            throw new NotLikedException(ERR_MSG_POST_NOT_LIKED);
        }

        post.getLikedByUsers().remove(user);
        post.setLikes(Math.max(0, post.getLikes() - 1));
        user.setCurrency(user.getCurrency() - 1);
        postRepository.save(post);
    }
}