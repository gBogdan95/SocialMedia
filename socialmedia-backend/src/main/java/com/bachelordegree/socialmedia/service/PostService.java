package com.bachelordegree.socialmedia.service;

import com.bachelordegree.socialmedia.dto.PostDTO;
import com.bachelordegree.socialmedia.exception.AlreadyLikedException;
import com.bachelordegree.socialmedia.exception.PostNotFoundException;
import com.bachelordegree.socialmedia.model.Post;
import com.bachelordegree.socialmedia.model.User;
import com.bachelordegree.socialmedia.repository.PostRepository;
import com.bachelordegree.socialmedia.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;

import static com.bachelordegree.socialmedia.exception.AlreadyLikedException.ERR_MSG_POST_ALREADY_LIKED;
import static com.bachelordegree.socialmedia.exception.PostNotFoundException.ERR_MSG_POST_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    @Autowired
    private UserRepository userRepository;
    public List<Post> getAll() {
        return postRepository.findAll();
    }

    public Post getById(UUID id) throws PostNotFoundException {
        return postRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException(ERR_MSG_POST_NOT_FOUND));
    }

    public Post save(Post post, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        post.setUser(user);
        return postRepository.save(post);
    }

    public Post update(UUID id, Post postUpdate, String username) throws PostNotFoundException, AccessDeniedException {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException(ERR_MSG_POST_NOT_FOUND));

        if (!post.getUser().getUsername().equals(username)) {
            throw new AccessDeniedException("User does not have permission to update this post");
        }

        post.setText(postUpdate.getText());
        return postRepository.save(post);
    }


    public void delete(UUID id) throws PostNotFoundException {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException(ERR_MSG_POST_NOT_FOUND));

        postRepository.delete(post);
    }

    @Transactional
    public void likePost(UUID postId, String username) throws PostNotFoundException, AlreadyLikedException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("Post not found with id: " + postId));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        boolean alreadyLiked = postRepository.existsByPostIdAndUserId(postId, user.getId());
        if (alreadyLiked) {
            throw new AlreadyLikedException("User already liked this post");
        } else {
            post.getLikedByUsers().add(user);
            post.setLikes(post.getLikes() + 1);
            postRepository.save(post);
        }
    }

    @Transactional
    public void unlikePost(UUID id) throws PostNotFoundException {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException(ERR_MSG_POST_NOT_FOUND));

        int currentLikes = post.getLikes();
        post.setLikes(Math.max(0, currentLikes - 1));
        postRepository.save(post);
    }
}