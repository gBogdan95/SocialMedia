package com.bachelordegree.socialmedia.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ExceptionHandlingController {

    public static final String CLIENT_REQUEST_PROBLEM = "CLIENT_REQUEST_PROBLEM";
    public static final String SERVER_PROBLEM = "SERVER_PROBLEM";
    public static final String ERR_MSG_UNEXPECTED = "Unexpected exception occurred, please contact your administrator";

    @ExceptionHandler(RestException.class)
    ResponseEntity<ErrorResponse> handleRestException(RestException ex) {
        ErrorResponse errorResponse = new ErrorResponse(CLIENT_REQUEST_PROBLEM, ex.getMessage());
        return new ResponseEntity<>(errorResponse, ex.getHttpStatus());
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<ErrorResponse> handleException(Exception ex) {
        ErrorResponse errorResponse = new ErrorResponse(SERVER_PROBLEM, ERR_MSG_UNEXPECTED);
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}