package com.bachelordegree.socialmedia.exception;

public class CustomAuthenticationException extends Exception {

    public static final String  ERR_MSG_LOGIN_FAILED = "Incorrect username or password";
    public CustomAuthenticationException(String msg) {
        super(msg);
    }
}
