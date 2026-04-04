package com.tourtravel.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Hotel amenity tag (e.g., WiFi, Pool, Air Conditioning).
 */
@Entity
@Table(name = "hotel_amenities")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HotelAmenity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id", nullable = false)
    private Hotel hotel;

    @Column(nullable = false, length = 100)
    private String amenity;
}
