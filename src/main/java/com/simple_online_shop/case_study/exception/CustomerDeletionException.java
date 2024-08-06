package com.simple_online_shop.case_study.exception;

public class CustomerDeletionException extends RuntimeException{
    public CustomerDeletionException(String message) {
        super(message);
    }

    public CustomerDeletionException(String message, Throwable cause) {
        super(message, cause);
    }
}
