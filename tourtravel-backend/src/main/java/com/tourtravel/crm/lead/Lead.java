package com.tourtravel.crm.lead;

import com.tourtravel.crm.customer.Customer;
import com.tourtravel.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Lead entity. A single sales opportunity against a Customer — one Customer can
 * generate many Leads over time (repeat/returning enquiries), each tracked through
 * its own pipeline independently. Status transitions and assignment go through
 * dedicated LeadService methods (not plain field updates) so each change is
 * captured on the owning Customer's timeline with a specific description.
 */
@Entity
@Table(name = "leads", indexes = {
    @Index(name = "idx_lead_customer", columnList = "customer_id"),
    @Index(name = "idx_lead_status", columnList = "status"),
    @Index(name = "idx_lead_assigned_to", columnList = "assigned_to")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Customer.CustomerSource source;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private LeadStatus status = LeadStatus.NEW;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String requirement;

    /** Staff member currently owning this lead. Null while unassigned. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean active = true;

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

    public enum LeadStatus {
        NEW, CONTACTED, QUALIFIED, QUOTED, WON, LOST
    }
}
