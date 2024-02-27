package com.bachelordegree.socialmedia.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice
public class ExceptionHandlingController {

    public static final String CLIENT_REQUEST_PROBLEM = "CLIENT_REQUEST_PROBLEM";
    public static final String SERVER_PROBLEM = "SERVER_PROBLEM";
    public static final String VALIDATION_PROBLEM = "VALIDATION_PROBLEM";
    public static final String ERR_MSG_UNEXPECTED = "Unexpected exception occurred, please contact your administrator";

    @ExceptionHandler(RestException.class)
    ResponseEntity<ErrorResponse> handleRestException(RestException ex) {
        ErrorResponse errorResponse = new ErrorResponse(CLIENT_REQUEST_PROBLEM, ex.getMessage());
        return new ResponseEntity<>(errorResponse, ex.getHttpStatus());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        var errorMessages = ex.getBindingResult().getAllErrors().stream()
                .map(error -> String.format("Check %s: %s.", ((FieldError) error).getField(), error.getDefaultMessage()))
                .collect(Collectors.joining("; "));

        ErrorResponse errorResponse = new ErrorResponse(VALIDATION_PROBLEM, errorMessages);
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }


    @ExceptionHandler(Exception.class)
    ResponseEntity<ErrorResponse> handleException(Exception ex) {
        ex.printStackTrace();
        ErrorResponse errorResponse = new ErrorResponse(SERVER_PROBLEM, ERR_MSG_UNEXPECTED);
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}