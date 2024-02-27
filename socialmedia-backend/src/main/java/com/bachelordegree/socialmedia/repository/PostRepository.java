package com.bachelordegree.socialmedia.repository;

import com.bachelordegree.socialmedia.model.Comment;
import com.bachelordegree.socialmedia.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, UUID> {
}