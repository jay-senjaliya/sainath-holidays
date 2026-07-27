package com.tourtravel.sales.quotation.dto;

import com.tourtravel.sales.quotation.Quotation.ApprovalStatus;
import com.tourtravel.sales.quotation.Quotation.QuotationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Lean response DTO for the Quotation list/search table.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuotationListResponse {

    private Long id;
    private String quotationNumber;
    private Long customerId;
    private String customerName;
    private String customerPhone;
    private Long packageId;
    private String packageTitle;
    private LocalDate travelDate;
    private BigDecimal finalAmount;
    private QuotationStatus status;
    private LocalDate validUntil;
    private boolean active;
    private LocalDateTime createdAt;
    private int itemCount;
    private ApprovalStatus approvalStatus;
}
