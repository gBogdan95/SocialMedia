package com.bachelordegree.socialmedia.exception;

public class InsufficientFundsException extends Exception{
    public static final String ERR_MSG_INSUFFICIENT_FUNDS = "You have insufficient funds to purchase this image";
    public InsufficientFundsException(String message) {
        super(message);
    }
}
