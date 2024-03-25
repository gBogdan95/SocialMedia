package com.bachelordegree.socialmedia.exception;

public class AlreadyLikedException extends Exception{
    public static final String  ERR_MSG_POST_ALREADY_LIKED = "Post already liked!";

    public static final String  ERR_MSG_COMMENT_ALREADY_LIKED = "Comment already liked!";

    public AlreadyLikedException(String msg) {
        super(msg);
    }
}
