package com.tourtravel.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Enquiry entity. Users can submit enquiries for packages, hotels, vehicles, or tickets.
 * Admin will manage status transitions.
 */
@Entity
@Table(name = "enquiries", indexes = {
    @Index(name = "idx_enquiry_user", columnList = "user_id"),
    @Index(name = "idx_enquiry_status", columnList = "status"),
    @Index(name = "idx_enquiry_service_type", columnList = "service_type")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Enquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** Optional — linked package for package enquiries */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id")
    private TourPackage tourPackage;

    @Enumerated(EnumType.STRING)
    @Column(name = "service_type", nullable = false, length = 20)
    private ServiceType serviceType;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private EnquiryStatus status = EnquiryStatus.PENDING;

    /** Admin notes/reply */
    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    public enum ServiceType {
        PACKAGE, HOTEL, VEHICLE, TICKET
    }

    public enum EnquiryStatus {
        PENDING, IN_PROGRESS, RESOLVED, CANCELLED
    }
}
