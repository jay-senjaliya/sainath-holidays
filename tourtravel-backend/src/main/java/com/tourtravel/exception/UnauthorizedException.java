package com.tourtravel.exception;

/**
 * Thrown when a user tries to perform an action they are not authorized for (403).
 */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }
}
