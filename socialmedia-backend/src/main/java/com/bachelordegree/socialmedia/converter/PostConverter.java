package com.bachelordegree.socialmedia.converter;

import com.bachelordegree.socialmedia.dto.PostDTO;
import com.bachelordegree.socialmedia.dto.UserDTO;
import com.bachelordegree.socialmedia.model.Post;
import com.bachelordegree.socialmedia.model.User;
import org.springframework.stereotype.Component;

@Component
public class PostConverter {

    public Post toEntity(PostDTO postDTO) {
        Post post = new Post();
        post.setText(postDTO.getText());
        post.setLikes(postDTO.getLikes());
        post.setTitle(postDTO.getTitle());
        return post;
    }

    public PostDTO toDTO(Post post) {
        PostDTO postDTO = new PostDTO();
        postDTO.setId(post.getId());
        postDTO.setText(post.getText());
        postDTO.setLikes(post.getLikes());
        postDTO.setTotalComments(post.getTotalComments());
        postDTO.setTitle(post.getTitle());

        if (post.getUser() != null) {
            UserDTO userDTO = toUserDTO(post.getUser());
            postDTO.setUser(userDTO);
        }

        return postDTO;
    }

    public PostDTO toDTO(Post post, String currentUsername) {
        PostDTO postDTO = new PostDTO();
        postDTO.setId(post.getId());
        postDTO.setText(post.getText());
        postDTO.setLikes(post.getLikes());
        postDTO.setTotalComments(post.getTotalComments());
        postDTO.setTitle(post.getTitle());

        if (post.getUser() != null) {
            UserDTO userDTO = toUserDTO(post.getUser());
            postDTO.setUser(userDTO);
        }

        boolean isLiked = post.getLikedByUsers().stream()
                .anyMatch(user -> user.getUsername().equals(currentUsername));
        postDTO.setLiked(isLiked);

        return postDTO;
    }

    private UserDTO toUserDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setAvatarUrl(user.getAvatarUrl());
        userDTO.setCurrency(user.getCurrency());
        return userDTO;
    }
}
