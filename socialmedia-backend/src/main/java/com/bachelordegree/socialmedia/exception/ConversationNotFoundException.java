package com.bachelordegree.socialmedia.exception;

public class ConversationNotFoundException extends Exception{
    public static final String  ERR_MSG_CONVERSATION_NOT_FOUND = "Conversation not found!";

    public ConversationNotFoundException(String msg) {
        super(msg);
    }
}
