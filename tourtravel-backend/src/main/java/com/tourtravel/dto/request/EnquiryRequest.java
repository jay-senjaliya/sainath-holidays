package com.tourtravel.dto.request;

import com.tourtravel.entity.Enquiry.ServiceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Request DTO submitted by end users for an Enquiry.
 */
@Data
public class EnquiryRequest {

    private Long packageId; // Optional — only set if serviceType == PACKAGE

    @NotNull(message = "Service type is required")
    private ServiceType serviceType;

    @NotBlank(message = "Message is required")
    private String message;
}
