package com.tourtravel.crm.lead.dto;

import com.tourtravel.crm.customer.Customer.CustomerSource;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Request DTO for creating/updating a Lead. Status is deliberately not settable
 * here — it's always NEW on create and only changes via the dedicated
 * PATCH /{id}/status endpoint, so every transition gets a specific, auditable
 * timeline entry instead of a silent field overwrite.
 */
@Data
public class LeadRequest {

    @NotNull(message = "Customer is required")
    private Long customerId;

    @NotNull(message = "Source is required")
    private CustomerSource source;

    @NotBlank(message = "Requirement is required")
    @Size(max = 2000, message = "Requirement must be at most 2000 characters")
    private String requirement;

    /** Optional — staff member to assign this lead to. */
    private Long assignedToId;

    private boolean active = true;
}
