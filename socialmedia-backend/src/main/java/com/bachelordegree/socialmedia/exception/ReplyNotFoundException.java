package com.bachelordegree.socialmedia.exception;

public class ReplyNotFoundException extends Exception{
    public static final String  ERR_MSG_REPLY_NOT_FOUND = "Reply not found!";

    public ReplyNotFoundException(String msg) {
        super(msg);
    }
}
