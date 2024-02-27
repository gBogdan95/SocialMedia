package com.bachelordegree.socialmedia.controller;

import com.bachelordegree.socialmedia.converter.ReplyConverter;
import com.bachelordegree.socialmedia.dto.ReplyDTO;
import com.bachelordegree.socialmedia.exception.CommentNotFoundException;
import com.bachelordegree.socialmedia.exception.ReplyNotFoundException;
import com.bachelordegree.socialmedia.exception.RestException;
import com.bachelordegree.socialmedia.model.Reply;
import com.bachelordegree.socialmedia.service.ReplyService;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user/replies")
@CrossOrigin(origins = "http://localhost:3000")
public class ReplyController {

    private final ReplyService replyService;

    private final ReplyConverter replyConverter;

    @GetMapping
    public List<ReplyDTO> getAll() {
        return replyService.getAll().stream()
                .map(replyConverter::toDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public ReplyDTO getById(@PathVariable @NotNull UUID id) {
        try {
            var reply = replyService.getById(id);
            return replyConverter.toDTO(reply);
        } catch (ReplyNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @GetMapping("/by-comment/{commentId}")
    public List<ReplyDTO> getRepliesByCommentId(@PathVariable UUID commentId) {
        return replyService.getRepliesByCommentId(commentId).stream()
                .map(replyConverter::toDTO)
                .toList();
    }

    @PostMapping("/{commentId}")
    public ReplyDTO createReply(@PathVariable UUID commentId, @RequestBody ReplyDTO replyDTO) {
        try {
            Reply reply = replyConverter.toEntity(replyDTO);
            reply = replyService.save(commentId, reply);
            return replyConverter.toDTO(reply);
        } catch (CommentNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }


    @PutMapping("/{id}")
    public ReplyDTO update(@PathVariable @NotNull UUID id, @RequestBody ReplyDTO replyDTO) {
        try {
            Reply replyToUpdate = replyConverter.toEntity(replyDTO);
            Reply updatedReply = replyService.update(id, replyToUpdate);
            return replyConverter.toDTO(updatedReply);
        } catch (ReplyNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable @NotNull UUID id) {
        try {
            replyService.delete(id);
        } catch (ReplyNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @PostMapping("/{id}/like")
    public ReplyDTO like(@PathVariable UUID id) {
        try {
            replyService.likeReply(id);
            Reply reply = replyService.getById(id);
            return replyConverter.toDTO(reply);
        } catch (ReplyNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @PostMapping("/{id}/remove-like")
    public ReplyDTO unlike(@PathVariable UUID id) {
        try {
            replyService.unlikeReply(id);
            Reply reply = replyService.getById(id);
            return replyConverter.toDTO(reply);
        } catch (ReplyNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @PostMapping("/{id}/dislike")
    public ReplyDTO dislike(@PathVariable UUID id) {
        try {
            replyService.dislikeReply(id);
            Reply reply = replyService.getById(id);
            return replyConverter.toDTO(reply);
        } catch (ReplyNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @PostMapping("/{id}/remove-dislike")
    public ReplyDTO removeDislike(@PathVariable UUID id) {
        try {
            replyService.removeDislikeReply(id);
            Reply reply = replyService.getById(id);
            return replyConverter.toDTO(reply);
        } catch (ReplyNotFoundException e) {
            throw new RestException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }
}