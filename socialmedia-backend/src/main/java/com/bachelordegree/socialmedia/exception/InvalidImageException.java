package com.bachelordegree.socialmedia.exception;

public class InvalidImageException extends Exception {
    public static final String ERR_MSG_INVALID_IMAGE = "Invalid image";
    public InvalidImageException(String message) {
        super(message);
    }
}