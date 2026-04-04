package com.tourtravel.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * TourPackage entity. Represents a travel package offered by the agency.
 * Supports day-wise itinerary and multiple images.
 */
@Entity
@Table(name = "tour_packages", indexes = {
    @Index(name = "idx_package_category", columnList = "category"),
    @Index(name = "idx_package_price", columnList = "price"),
    @Index(name = "idx_package_duration", columnList = "duration_days")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TourPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "duration_days", nullable = false)
    private Integer durationDays;

    /** GPS coordinates for map display */
    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false, length = 50)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PackageCategory category;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean active = true;

    /** Relations */
    @OneToMany(mappedBy = "tourPackage", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<PackageItinerary> itineraries = new ArrayList<>();

    @OneToMany(mappedBy = "tourPackage", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<PackageImage> images = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum PackageCategory {
        DOMESTIC, INTERNATIONAL, ADVENTURE, HONEYMOON, PILGRIMAGE, WILDLIFE, BEACH, CULTURAL
    }
}
