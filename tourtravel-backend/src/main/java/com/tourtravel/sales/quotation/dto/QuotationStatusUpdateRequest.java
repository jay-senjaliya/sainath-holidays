package com.tourtravel.sales.quotation.dto;

import com.tourtravel.sales.quotation.Quotation.QuotationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class QuotationStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private QuotationStatus status;
}
