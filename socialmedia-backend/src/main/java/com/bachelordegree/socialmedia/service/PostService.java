package com.bachelordegree.socialmedia.service;

import com.bachelordegree.socialmedia.exception.PostNotFoundException;
import com.bachelordegree.socialmedia.model.Post;
import com.bachelordegree.socialmedia.repository.PostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;

import static com.bachelordegree.socialmedia.exception.PostNotFoundException.ERR_MSG_POST_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    public List<Post> getAll() {
        return postRepository.findAll();
    }

    public Post getById(UUID id) throws PostNotFoundException {
        return postRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException(ERR_MSG_POST_NOT_FOUND));
    }

    public Post save(Post post) {
        return postRepository.save(post);
    }

    public Post update(UUID id, Post postUpdate) throws PostNotFoundException {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException(ERR_MSG_POST_NOT_FOUND));

        post.setText(postUpdate.getText());
        return postRepository.save(post);
    }

    public void delete(UUID id) throws PostNotFoundException {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException(ERR_MSG_POST_NOT_FOUND));

        postRepository.delete(post);
    }

    @Transactional
    public void likePost(UUID id) throws PostNotFoundException {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException(ERR_MSG_POST_NOT_FOUND));

        post.setLikes(post.getLikes() + 1);
        postRepository.save(post);
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