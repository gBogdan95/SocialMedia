package com.bachelordegree.socialmedia.repository;

import com.bachelordegree.socialmedia.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {
    List<Comment> findAllByPostIdOrderByCreatedAtAsc(UUID postId);

    @Query("SELECT COUNT(l) > 0 FROM Comment c JOIN c.likedByUsers l WHERE c.id = :commentId AND l.id = :userId")
    boolean likedByUser(@Param("commentId") UUID commentId, @Param("userId") UUID userId);
}
