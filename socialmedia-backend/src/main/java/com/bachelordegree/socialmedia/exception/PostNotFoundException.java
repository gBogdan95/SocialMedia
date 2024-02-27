package com.bachelordegree.socialmedia.exception;

public class PostNotFoundException extends Exception {
    public static final String  ERR_MSG_POST_NOT_FOUND = "Post not found!";

    public PostNotFoundException(String msg) {
        super(msg);
    }
}