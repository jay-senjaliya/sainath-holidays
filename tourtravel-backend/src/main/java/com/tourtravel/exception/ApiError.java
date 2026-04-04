package com.tourtravel.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Standard error response body returned by the global exception handler.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiError {

    private int status;
    private String error;
    private String message;
    private String path;
    private LocalDateTime timestamp;

    /** Field-level validation errors */
    private List<FieldError> fieldErrors;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class FieldError {
        private String field;
        private String rejectedValue;
        private String message;
    }
}
