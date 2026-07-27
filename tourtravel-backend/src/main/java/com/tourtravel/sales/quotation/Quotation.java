package com.tourtravel.sales.quotation;

import com.tourtravel.crm.customer.Customer;
import com.tourtravel.entity.TourPackage;
import com.tourtravel.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Quotation entity — the Sales module's proposal document against a Customer.
 *
 * Phase 2 added the {@link #items} line-item builder and a pricing engine on
 * top of Phase 1's flat fields, additively: when {@code items} is non-empty,
 * QuotationService computes totalAmount/finalAmount from it authoritatively;
 * when empty, totalAmount/discount/finalAmount stay exactly as Phase 1 left
 * them — independently staff-entered, not derived. This means quotations
 * created before Phase 2 (zero items) keep working unchanged.
 */
@Entity
@Table(name = "quotations", indexes = {
    @Index(name = "idx_quotation_customer", columnList = "customer_id"),
    @Index(name = "idx_quotation_status", columnList = "status"),
    @Index(name = "idx_quotation_number", columnList = "quotation_number")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Quotation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Assigned after the first save, once the id is known — see QuotationService. */
    @Column(name = "quotation_number", unique = true, length = 20)
    private String quotationNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    /** Optional — not every quotation is against a catalog Package. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id")
    private TourPackage tourPackage;

    @Column(name = "travel_date", nullable = false)
    private LocalDate travelDate;

    @Column(name = "number_of_adults", nullable = false)
    private Integer numberOfAdults;

    @Column(name = "number_of_children", nullable = false)
    @Builder.Default
    private Integer numberOfChildren = 0;

    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Column(nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(name = "final_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal finalAmount;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "valid_until", nullable = false)
    private LocalDate validUntil;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private QuotationStatus status = QuotationStatus.DRAFT;

    /** Overrides CompanySettings.defaultTermsAndConditions for this quote when set. */
    @Column(name = "terms_and_conditions", columnDefinition = "TEXT")
    private String termsAndConditions;

    /**
     * Unguessable token backing the public, unauthenticated PDF share link
     * (see QuotationShareController) — generated lazily on first "Share via
     * WhatsApp"/share-link request, not on every quotation.
     */
    @Column(name = "share_token", unique = true, length = 36)
    private String shareToken;

    /**
     * Discount-threshold approval gate (see CompanySettings.approvalDiscountThreshold).
     * Recomputed on every create/update from the current discount — not a real
     * access-control gate until distinct staff roles exist (see class javadoc
     * on ApprovalStatus), but it does block send-email/WhatsApp while PENDING.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status", nullable = false, length = 20)
    @Builder.Default
    private ApprovalStatus approvalStatus = ApprovalStatus.NOT_REQUIRED;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean active = true;

    @OneToMany(mappedBy = "quotation", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("displayOrder ASC")
    @Builder.Default
    private List<QuotationItem> items = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    /** Reserved for the multi-tenancy retrofit — see Customer.tenantId. */
    @Column(name = "tenant_id")
    private Long tenantId;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum QuotationStatus {
        DRAFT, SENT, ACCEPTED, REJECTED, EXPIRED
    }

    /**
     * NOT_REQUIRED/PENDING are set automatically by QuotationService based on
     * CompanySettings.approvalDiscountThreshold; APPROVED/REJECTED are only
     * ever set via the explicit PATCH /{id}/approval action. This is scaffolding
     * for a real Sales-Manager-approves-Sales-Executive workflow — see
     * docs/04_USER_ROLES.md, which documents that no such role distinction
     * exists yet. Until it does, any admin can approve any quote, including
     * their own; the one real effect today is that sending (email/WhatsApp) is
     * blocked while PENDING.
     */
    public enum ApprovalStatus {
        NOT_REQUIRED, PENDING, APPROVED, REJECTED
    }
}
