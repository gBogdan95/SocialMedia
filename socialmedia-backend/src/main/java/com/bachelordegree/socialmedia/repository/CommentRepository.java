package com.bachelordegree.socialmedia.repository;

import com.bachelordegree.socialmedia.model.Comment;
import com.bachelordegree.socialmedia.model.Post;
import com.bachelordegree.socialmedia.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {
    List<Comment> findAllByPostIdOrderByCreatedAtDesc(UUID postId);

    @Query("SELECT COUNT(l) > 0 FROM Comment c JOIN c.likedByUsers l WHERE c.id = :commentId AND l.id = :userId")
    boolean existsByCommentIdAndUserId(@Param("commentId") UUID commentId, @Param("userId") UUID userId);
}
