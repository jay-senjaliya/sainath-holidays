package com.tourtravel.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

/**
 * Request DTO for sending OTP to a phone number.
 */
@Data
public class SendOtpRequest {

    @NotBlank(message = "Phone number is required")
    @Pattern(
        regexp = "^\\+?[1-9]\\d{9,14}$",
        message = "Phone number must be in international format (e.g. +919876543210)"
    )
    private String phone;
}
