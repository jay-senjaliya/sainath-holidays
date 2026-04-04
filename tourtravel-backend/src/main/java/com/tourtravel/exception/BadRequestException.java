package com.tourtravel.exception;

/**
 * Thrown when a business rule is violated (409 / 422 scenarios).
 */
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}
