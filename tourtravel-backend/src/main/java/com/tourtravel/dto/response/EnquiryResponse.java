package com.tourtravel.dto.response;

import com.tourtravel.dto.response.AuthResponse.UserSummary;
import com.tourtravel.entity.Enquiry.EnquiryStatus;
import com.tourtravel.entity.Enquiry.ServiceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO for Enquiries.
 * Includes user summary and optional package title.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnquiryResponse {

    private Long id;
    private ServiceType serviceType;
    private String message;
    private EnquiryStatus status;
    private String adminNotes;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;

    private UserSummary user;
    
    // Only populated if linked to a package
    private Long packageId;
    private String packageTitle;
}
