package com.bachelordegree.socialmedia.exception;

public class UserAlreadyExistsException extends Exception {
    public static final String  ERR_MSG_USER_ALREADY_EXISTS = "This username already exists!";

    public UserAlreadyExistsException(String msg) {
        super(msg);
    }
}
