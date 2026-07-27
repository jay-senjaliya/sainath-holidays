package com.tourtravel.crm.customer;

import com.tourtravel.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Customer entity. The CRM system-of-record contact for a person the agency deals with —
 * independent of whether that person ever creates a website login (most walk-in / phone
 * customers never do). Optionally linked to a User account via {@link #linkedUser}.
 */
@Entity
@Table(name = "customers", indexes = {
    @Index(name = "idx_customer_phone", columnList = "phone"),
    @Index(name = "idx_customer_email", columnList = "email"),
    @Index(name = "idx_customer_source", columnList = "source"),
    @Index(name = "idx_customer_city", columnList = "city")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 150)
    private String email;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(name = "alternate_phone", length = 20)
    private String alternatePhone;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(length = 100)
    private String country;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CustomerSource source;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean active = true;

    /** Optional link to a website account, if this customer also has one. Unset by default. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "linked_user_id")
    private User linkedUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    /**
     * Reserved for the multi-tenancy retrofit (docs/06_SYSTEM_ARCHITECTURE.md §18).
     * Not enforced or exposed via the API yet — deliberately unused until the Platform layer exists.
     */
    @Column(name = "tenant_id")
    private Long tenantId;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum CustomerSource {
        WALK_IN, PHONE_CALL, WEBSITE, REFERRAL, SOCIAL_MEDIA, WHATSAPP, OTHER
    }
}
