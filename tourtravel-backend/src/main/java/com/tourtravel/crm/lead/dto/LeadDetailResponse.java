package com.tourtravel.crm.lead.dto;

import com.tourtravel.crm.customer.Customer.CustomerSource;
import com.tourtravel.crm.lead.Lead.LeadStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Full detail response DTO for a specific lead.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeadDetailResponse {

    private Long id;
    private Long customerId;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private CustomerSource source;
    private LeadStatus status;
    private String requirement;
    private Long assignedToId;
    private String assignedToName;
    private boolean active;
    private String createdByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
