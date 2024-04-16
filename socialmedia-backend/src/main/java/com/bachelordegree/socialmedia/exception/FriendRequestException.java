package com.bachelordegree.socialmedia.exception;

public class FriendRequestException extends Exception{
    public static final String ERR_MSG_USER_BLOCKED_RECEIVING_FRIEND_REQUESTS = "This user doesn't allow receiving friend requests.";

    public FriendRequestException(String message) {
        super(message);
    }
}