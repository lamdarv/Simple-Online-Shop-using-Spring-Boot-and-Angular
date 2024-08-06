package com.simple_online_shop.case_study.exception;

public class ItemDeletionException extends RuntimeException{
    public ItemDeletionException(String message) {
        super(message);
    }

    public ItemDeletionException(String message, Throwable cause) {
        super(message, cause);
    }
}
