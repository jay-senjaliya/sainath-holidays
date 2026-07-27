package com.tourtravel.sales.quotation.dto;

import com.tourtravel.sales.quotation.Quotation.ApprovalStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Only APPROVED/REJECTED are accepted — NOT_REQUIRED/PENDING are computed by
 * QuotationService, never set directly by a client.
 */
@Data
public class ApprovalUpdateRequest {

    @NotNull(message = "Approval status is required")
    private ApprovalStatus approvalStatus;
}
