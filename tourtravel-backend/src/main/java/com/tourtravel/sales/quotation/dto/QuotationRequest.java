package com.tourtravel.sales.quotation.dto;

import com.tourtravel.sales.quotation.QuotationItem.ItemType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Request DTO for creating/updating a Quotation. Status is deliberately not
 * settable here — same rationale as LeadRequest: always DRAFT on create, changed
 * only via the dedicated PATCH /{id}/status endpoint so every transition is
 * individually auditable on the customer's timeline.
 *
 * Phase 2: totalAmount/finalAmount are no longer unconditionally required —
 * when {@code items} is non-empty the pricing engine computes them server-side
 * and ignores whatever's submitted here; they're only required, and enforced in
 * QuotationService, for the legacy manual-entry path (zero items).
 */
@Data
public class QuotationRequest {

    @NotNull(message = "Customer is required")
    private Long customerId;

    /** Optional — not every quotation is against a catalog Package. */
    private Long packageId;

    @NotNull(message = "Travel date is required")
    private LocalDate travelDate;

    @NotNull(message = "Number of adults is required")
    @Min(value = 1, message = "At least 1 adult is required")
    private Integer numberOfAdults;

    @NotNull(message = "Number of children is required")
    @Min(value = 0, message = "Number of children cannot be negative")
    private Integer numberOfChildren = 0;

    /** Required only when {@code items} is empty — see QuotationService. */
    @DecimalMin(value = "0.0", message = "Total amount cannot be negative")
    private BigDecimal totalAmount;

    @NotNull(message = "Discount is required")
    @DecimalMin(value = "0.0", message = "Discount cannot be negative")
    private BigDecimal discount = BigDecimal.ZERO;

    /** Required only when {@code items} is empty — see QuotationService. */
    @DecimalMin(value = "0.0", message = "Final amount cannot be negative")
    private BigDecimal finalAmount;

    @Size(max = 2000, message = "Notes must be at most 2000 characters")
    private String notes;

    @NotNull(message = "Valid until date is required")
    private LocalDate validUntil;

    /** Optional — overrides CompanySettings.defaultTermsAndConditions on the PDF when set. */
    private String termsAndConditions;

    private boolean active = true;

    /** Phase 2 line-item builder. Empty = legacy flat-total mode. */
    @Valid
    private List<QuotationItemRequest> items = new ArrayList<>();

    @Data
    public static class QuotationItemRequest {

        @NotNull(message = "Item type is required")
        private ItemType itemType;

        /** Required for PACKAGE/HOTEL/VEHICLE (validated against the catalog);
         *  must be omitted for ACTIVITY, which has no catalog. */
        private Long referenceId;

        /** Only used (and required) for ACTIVITY — catalog types get their
         *  name from the referenced Package/Hotel/Vehicle, not from here. */
        @Size(max = 200, message = "Item name must be at most 200 characters")
        private String itemName;

        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;

        @NotNull(message = "Unit price is required")
        @DecimalMin(value = "0.0", message = "Unit price cannot be negative")
        private BigDecimal unitPrice;

        @Size(max = 500, message = "Notes must be at most 500 characters")
        private String notes;
    }
}
