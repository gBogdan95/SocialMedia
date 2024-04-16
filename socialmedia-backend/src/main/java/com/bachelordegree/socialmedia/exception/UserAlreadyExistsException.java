package com.bachelordegree.socialmedia.exception;

public class UserAlreadyExistsException extends Exception {
    public static final String  ERR_MSG_USER_ALREADY_EXISTS = "Error";

    public UserAlreadyExistsException(String msg) {
        super(msg);
    }
}
