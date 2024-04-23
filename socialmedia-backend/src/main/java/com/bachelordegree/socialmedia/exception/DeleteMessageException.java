package com.bachelordegree.socialmedia.exception;

public class DeleteMessageException extends Exception {
    public static final String ERR_MSG_UNAUTHORIZED_TO_DELETE = "Cannot delete messages from another user.";
    public DeleteMessageException (String msg) {
        super(msg);
    }
}
