package com.tourtravel.crm.timeline;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Generic, append-only activity log entry for any CRM entity (Customer today; Lead,
 * Booking, etc. later). Deliberately keyed by (entityType, entityId) rather than a
 * dedicated FK per entity so future modules can log into the same table without a
 * new migration. {@code performedByName} is a denormalized snapshot, not a User FK —
 * the log should stay readable even if the acting user is later removed.
 */
@Entity
@Table(name = "timeline_events", indexes = {
    @Index(name = "idx_timeline_entity", columnList = "entity_type, entity_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TimelineEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "entity_type", nullable = false, length = 30)
    private EntityType entityType;

    @Column(name = "entity_id", nullable = false)
    private Long entityId;

    @Column(name = "event_type", nullable = false, length = 50)
    private String eventType;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "performed_by_name", length = 100)
    private String performedByName;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum EntityType {
        CUSTOMER
    }
}
