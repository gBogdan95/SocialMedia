package com.bachelordegree.socialmedia.converter;

import com.bachelordegree.socialmedia.dto.PostDTO;
import com.bachelordegree.socialmedia.model.Post;
import org.springframework.stereotype.Component;

@Component
public class PostConverter {

    public Post toEntity(PostDTO postDTO) {
        Post post = new Post();
        post.setText(postDTO.getText());
        post.setLikes(postDTO.getLikes());
        post.setDislikes(postDTO.getDislikes());

        return post;
    }

    public PostDTO toDTO(Post post) {
        PostDTO postDTO = new PostDTO();
        postDTO.setId(post.getId());
        postDTO.setText(post.getText());
        postDTO.setLikes(post.getLikes());
        postDTO.setDislikes(post.getDislikes());

        return postDTO;
    }
}
