package com.bachelordegree.socialmedia.converter;

import com.bachelordegree.socialmedia.dto.PostDTO;
import com.bachelordegree.socialmedia.model.Post;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PostConverter {

    @Autowired
    private UserConverter userConverter;

    public Post toEntity(PostDTO postDTO) {
        Post post = new Post();
        post.setText(postDTO.getText());
        post.setLikes(postDTO.getLikes());
        post.setTitle(postDTO.getTitle());
        post.setImageUrl(postDTO.getImageUrl());
        return post;
    }

    public PostDTO toDTO(Post post) {
        PostDTO postDTO = new PostDTO();
        postDTO.setId(post.getId());
        postDTO.setTitle(post.getTitle());
        postDTO.setText(post.getText());
        postDTO.setImageUrl(post.getImageUrl());
        postDTO.setLikes(post.getLikes());
        postDTO.setTotalComments(post.getTotalComments());

        if (post.getUser() != null) {
            postDTO.setUser(userConverter.toDTO(post.getUser()));
        }

        return postDTO;
    }

    public PostDTO toDTO(Post post, String currentUsername) {
        PostDTO postDTO = new PostDTO();
        postDTO.setId(post.getId());
        postDTO.setTitle(post.getTitle());
        postDTO.setText(post.getText());
        postDTO.setImageUrl(post.getImageUrl());
        postDTO.setLikes(post.getLikes());
        postDTO.setTotalComments(post.getTotalComments());

        if (post.getUser() != null) {
            postDTO.setUser(userConverter.toDTO(post.getUser()));
        }

        boolean isLiked = post.getLikedByUsers().stream()
                .anyMatch(user -> user.getUsername().equals(currentUsername));
        postDTO.setLiked(isLiked);

        return postDTO;
    }
}
