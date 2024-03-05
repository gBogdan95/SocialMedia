package com.bachelordegree.socialmedia.service;

import com.bachelordegree.socialmedia.exception.CommentNotFoundException;
import com.bachelordegree.socialmedia.exception.ReplyNotFoundException;
import com.bachelordegree.socialmedia.model.Comment;
import com.bachelordegree.socialmedia.model.Reply;
import com.bachelordegree.socialmedia.repository.CommentRepository;
import com.bachelordegree.socialmedia.repository.ReplyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static com.bachelordegree.socialmedia.exception.CommentNotFoundException.ERR_MSG_COMMENT_NOT_FOUND;
import static com.bachelordegree.socialmedia.exception.ReplyNotFoundException.ERR_MSG_REPLY_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class ReplyService {

    private final ReplyRepository replyRepository;
    private final CommentRepository commentRepository;

    public List<Reply> getAll() {
        return replyRepository.findAll();
    }

    public Reply getById(UUID id) throws ReplyNotFoundException {
        return replyRepository.findById(id)
                .orElseThrow(() -> new ReplyNotFoundException(ERR_MSG_REPLY_NOT_FOUND));
    }

    public List<Reply> getRepliesByCommentId(UUID commentId) {
        return replyRepository.findAllByCommentId(commentId);
    }

    public Reply save(UUID commentId, Reply reply) throws CommentNotFoundException {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException(ERR_MSG_COMMENT_NOT_FOUND));

        reply.setComment(comment);
        return replyRepository.save(reply);
    }


    public Reply update(UUID id, Reply replyUpdate) throws ReplyNotFoundException {
        Reply reply = replyRepository.findById(id)
                .orElseThrow(() -> new ReplyNotFoundException(ERR_MSG_REPLY_NOT_FOUND));

        reply.setText(replyUpdate.getText());
        return replyRepository.save(reply);
    }

    public void delete(UUID id) throws ReplyNotFoundException {
        Reply reply = replyRepository.findById(id)
                .orElseThrow(() -> new ReplyNotFoundException(ERR_MSG_REPLY_NOT_FOUND));

        replyRepository.delete(reply);
    }

    @Transactional
    public void likeReply(UUID id) throws ReplyNotFoundException {
        Reply reply = replyRepository.findById(id)
                .orElseThrow(() -> new ReplyNotFoundException(ERR_MSG_REPLY_NOT_FOUND));

        reply.setLikes(reply.getLikes() + 1);

        replyRepository.save(reply);
    }

    @Transactional
    public void unlikeReply(UUID id) throws ReplyNotFoundException {
        Reply reply = replyRepository.findById(id)
                .orElseThrow(() -> new ReplyNotFoundException(ERR_MSG_REPLY_NOT_FOUND));

        int currentLikes = reply.getLikes();
        reply.setLikes(Math.max(0, currentLikes - 1));

        replyRepository.save(reply);
    }
}