package com.bachelordegree.socialmedia.repository;

import com.bachelordegree.socialmedia.model.Reply;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReplyRepository extends JpaRepository<Reply, UUID> {
    List<Reply> findAllByCommentId(UUID commentId);
}
