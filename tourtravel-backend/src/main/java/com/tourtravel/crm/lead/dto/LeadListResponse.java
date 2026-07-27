package com.tourtravel.crm.lead.dto;

import com.tourtravel.crm.customer.Customer.CustomerSource;
import com.tourtravel.crm.lead.Lead.LeadStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Lean response DTO for the Lead list/search table and the Pipeline board cards.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeadListResponse {

    private Long id;
    private Long customerId;
    private String customerName;
    private String customerPhone;
    private CustomerSource source;
    private LeadStatus status;
    private String requirement;
    private Long assignedToId;
    private String assignedToName;
    private boolean active;
    private LocalDateTime createdAt;
}
