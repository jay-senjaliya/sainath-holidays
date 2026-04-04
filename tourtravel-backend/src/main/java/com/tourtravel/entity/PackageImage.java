package com.tourtravel.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Stores image URLs for a tour package.
 * One package can have multiple images; one is marked as primary.
 */
@Entity
@Table(name = "package_images")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PackageImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id", nullable = false)
    private TourPackage tourPackage;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(name = "is_primary", nullable = false)
    @Builder.Default
    private boolean primary = false;
}
