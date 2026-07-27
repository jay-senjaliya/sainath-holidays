package com.tourtravel.sales.quotation.dto;

import com.tourtravel.sales.quotation.Quotation.ApprovalStatus;
import com.tourtravel.sales.quotation.Quotation.QuotationStatus;
import com.tourtravel.sales.quotation.QuotationItem.ItemType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Full detail response DTO for a specific quotation — backs the View screen.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuotationDetailResponse {

    private Long id;
    private String quotationNumber;
    private Long customerId;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private Long packageId;
    private String packageTitle;
    private LocalDate travelDate;
    private Integer numberOfAdults;
    private Integer numberOfChildren;
    private BigDecimal totalAmount;
    private BigDecimal discount;
    private BigDecimal finalAmount;
    private String notes;
    private LocalDate validUntil;
    private QuotationStatus status;
    private String termsAndConditions;
    private boolean active;
    private String createdByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /** True when totalAmount/finalAmount were computed by the pricing engine
     *  from {@code items} rather than manually entered (Phase 1 legacy mode). */
    private boolean computedPricing;

    private ApprovalStatus approvalStatus;
    private String approvedByName;
    private LocalDateTime approvedAt;

    private List<QuotationItemResponse> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuotationItemResponse {
        private Long id;
        private ItemType itemType;
        private Long referenceId;
        private String itemName;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal subtotal;
        private String notes;
    }
}
