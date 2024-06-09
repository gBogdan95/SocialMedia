package com.bachelordegree.socialmedia.exception;

public class RoleNotFoundException extends Exception {
    public static final String ERR_MSG_ROLE_NOT_FOUND = "Role not found!";
    public RoleNotFoundException(String msg) {
        super(msg);
    }
}
