package com.bachelordegree.socialmedia.exception;

public class NotLikedException extends Exception {
    public static final String  ERR_MSG_POST_NOT_LIKED = "User has not liked this post!";
    public NotLikedException(String message) {
        super(message);
    }
}
