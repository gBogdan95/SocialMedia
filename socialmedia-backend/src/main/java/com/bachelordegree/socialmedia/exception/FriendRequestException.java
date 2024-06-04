package com.bachelordegree.socialmedia.exception;

public class FriendRequestException extends Exception{
    public static final String ERR_MSG_CANNOT_SNE_FRIEND_REQUEST_TO_ONESELF = "Cannot send a friend request to oneself.";
    public static final String ERR_MSG_USER_BLOCKED_RECEIVING_FRIEND_REQUESTS = "This user doesn't allow receiving friend requests.";

    public static final String ERR_MSG_FRIEND_REQUEST_ALREADY_SENT = "Friend request already sent.";

    public static final String ERR_MSG_FRIEND_ALREADY_FRIENDS = "You and this user are already friends.";


    public FriendRequestException(String message) {
        super(message);
    }
}