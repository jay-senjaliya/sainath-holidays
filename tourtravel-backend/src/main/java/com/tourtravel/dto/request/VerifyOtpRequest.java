package com.tourtravel.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Request DTO for verifying the OTP and logging in via phone number.
 */
@Data
public class VerifyOtpRequest {

    @NotBlank(message = "Phone number is required")
    @Pattern(
        regexp = "^\\+?[1-9]\\d{9,14}$",
        message = "Phone number must be in international format"
    )
    private String phone;

    @NotBlank(message = "OTP is required")
    @Size(min = 6, max = 6, message = "OTP must be exactly 6 digits")
    @Pattern(regexp = "^[0-9]{6}$", message = "OTP must be numeric")
    private String otp;

    /** Optional — user provides name on first login via phone */
    private String name;
}
