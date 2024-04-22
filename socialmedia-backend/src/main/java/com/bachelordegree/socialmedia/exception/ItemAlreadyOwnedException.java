package com.bachelordegree.socialmedia.exception;

public class ItemAlreadyOwnedException extends Exception{
    public static final String ERR_MSG_ITEM_ALREADY_OWNED = "You already own this item.";
    public ItemAlreadyOwnedException(String message) {
        super(message);
    }
}
