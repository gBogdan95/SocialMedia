package com.bachelordegree.socialmedia.exception;

public class SendMessageException extends Exception {
    public static final String ERR_MSG_USER_BLOCKED_RECEIVING_MESSAGES_FROM_NON_FRIENDS = "This user doesn't allow receiving messages from non-friends.";

    public SendMessageException (String message) {
        super(message);
    }
}
