package com.tourtravel.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Represents a single day's plan in a tour package itinerary.
 */
@Entity
@Table(name = "package_itineraries")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PackageItinerary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id", nullable = false)
    private TourPackage tourPackage;

    @Column(name = "day_number", nullable = false)
    private Integer dayNumber;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
}
