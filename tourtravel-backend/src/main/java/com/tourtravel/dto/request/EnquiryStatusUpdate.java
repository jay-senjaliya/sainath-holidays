package com.tourtravel.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Request DTO for Admins to update an Enquiry status.
 */
@Data
public class EnquiryStatusUpdate {

    @NotBlank(message = "Status (RESOLVED or PENDING) is required")
    private String status;

    private String adminNotes;
}
