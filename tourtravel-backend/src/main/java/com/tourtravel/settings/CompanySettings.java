package com.tourtravel.settings;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Agency-wide branding/config, used by the Quotation PDF today and by Finance
 * invoices later. Deliberately a singleton (one row) rather than per-user
 * settings — CompanySettingsService enforces get-or-create-default semantics.
 * Not quotation-specific, so it lives in its own package rather than inside
 * sales.quotation.
 */
@Entity
@Table(name = "company_settings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CompanySettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_name", nullable = false, length = 200)
    private String companyName;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(length = 20)
    private String phone;

    @Column(length = 150)
    private String email;

    @Column(name = "gst_number", length = 30)
    private String gstNumber;

    @Column(length = 200)
    private String website;

    @Column(name = "default_terms_and_conditions", columnDefinition = "TEXT")
    private String defaultTermsAndConditions;

    /**
     * If set, any quotation whose discount is >= this amount requires approval
     * before it can be sent (see Quotation.approvalStatus). Null/zero = never
     * required. This is plumbing, not a real access-control gate, until the
     * platform has more than one staff role (see docs/04_USER_ROLES.md) —
     * today any admin can approve any quote, including their own.
     */
    @Column(name = "approval_discount_threshold", precision = 12, scale = 2)
    private BigDecimal approvalDiscountThreshold;

    /** Reserved for the multi-tenancy retrofit — see Customer.tenantId. */
    @Column(name = "tenant_id")
    private Long tenantId;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
