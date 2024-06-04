package com.bachelordegree.socialmedia.exception;

public class FriendshipNotFoundException extends Exception {
    public static final String ERR_MSG_FRIENDSHIP_NOT_FOUND = "Friend request not found!";
    public FriendshipNotFoundException(String msg) {
        super(msg);
    }
}
