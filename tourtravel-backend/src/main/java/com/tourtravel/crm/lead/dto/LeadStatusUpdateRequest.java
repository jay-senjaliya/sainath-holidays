package com.tourtravel.crm.lead.dto;

import com.tourtravel.crm.lead.Lead.LeadStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LeadStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private LeadStatus status;
}
