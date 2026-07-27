package com.tourtravel.crm.timeline;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * In-process domain event published by any module when something timeline-worthy
 * happens to one of its entities. {@link TimelineEventListener} persists it after
 * the publishing transaction commits (see docs/06_SYSTEM_ARCHITECTURE.md §5 for why
 * an in-process event bus, not a direct repository call, decouples this).
 */
@Getter
@RequiredArgsConstructor
public class EntityActivityEvent {

    private final TimelineEvent.EntityType entityType;
    private final Long entityId;
    private final String eventType;
    private final String description;
    private final String performedByName;
}
