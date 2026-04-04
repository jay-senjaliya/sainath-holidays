package com.tourtravel.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Vehicle entity for the rental module.
 * Admin manages availability and pricing.
 */
@Entity
@Table(name = "vehicles", indexes = {
    @Index(name = "idx_vehicle_type", columnList = "vehicle_type"),
    @Index(name = "idx_vehicle_available", columnList = "available")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type", nullable = false, length = 30)
    private VehicleType vehicleType;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "price_per_day", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerDay;

    @Column(name = "seating_capacity", nullable = false)
    private Integer seatingCapacity;

    @Column(nullable = false)
    @Builder.Default
    private boolean available = true;

    @Column(name = "image_url")
    private String imageUrl;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum VehicleType {
        SEDAN, SUV, TEMPO_TRAVELLER, BUS, LUXURY, BIKE
    }
}
