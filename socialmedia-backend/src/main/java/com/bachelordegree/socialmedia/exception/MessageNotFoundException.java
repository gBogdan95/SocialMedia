package com.bachelordegree.socialmedia.exception;

public class MessageNotFoundException extends Exception{
    public static final String  ERR_MSG_MESSAGE_NOT_FOUND = "Message not found!";

    public MessageNotFoundException(String msg) {
        super(msg);
    }
}