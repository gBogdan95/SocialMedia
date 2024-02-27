package com.bachelordegree.socialmedia.converter;

import com.bachelordegree.socialmedia.dto.ReplyDTO;
import com.bachelordegree.socialmedia.model.Reply;
import org.springframework.stereotype.Component;

@Component
public class ReplyConverter {

    public Reply toEntity(ReplyDTO replyDTO) {
        Reply reply = new Reply();
        reply.setText(replyDTO.getText());
        reply.setLikes(replyDTO.getLikes());
        reply.setDislikes(replyDTO.getDislikes());

        return reply;
    }

    public ReplyDTO toDTO(Reply reply) {
        ReplyDTO replyDTO = new ReplyDTO();
        replyDTO.setId(reply.getId());
        replyDTO.setText(reply.getText());
        replyDTO.setLikes(reply.getLikes());
        replyDTO.setDislikes(reply.getDislikes());

        return replyDTO;
    }
}