package com.bachelordegree.socialmedia.exception;

public class ShopItemNotFoundException extends Exception {
    public static final String ERR_MSG_SHOP_ITEM_NOT_FOUND = "Shop item not found!";

    public ShopItemNotFoundException(String msg) {
        super(msg);
    }
}
