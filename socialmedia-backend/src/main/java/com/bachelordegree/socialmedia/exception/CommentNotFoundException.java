package com.bachelordegree.socialmedia.exception;

public class CommentNotFoundException extends Exception {

    public static final String  ERR_MSG_COMMENT_NOT_FOUND = "Comment not found!";

    public CommentNotFoundException(String msg) {
        super(msg);
    }
}