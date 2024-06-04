package com.bachelordegree.socialmedia.repository;

import com.bachelordegree.socialmedia.model.Post;
import com.bachelordegree.socialmedia.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, UUID> {
    List<Post> findAllByOrderByCreatedAtDesc();

    List<Post> findAllByUserOrderByCreatedAtDesc(User user);

    @Query("SELECT COUNT(l) > 0 FROM Post p JOIN p.likedByUsers l WHERE p.id = :postId AND l.id = :userId")
    boolean existsByPostIdAndUserId(@Param("postId") UUID postId, @Param("userId") UUID userId);
}