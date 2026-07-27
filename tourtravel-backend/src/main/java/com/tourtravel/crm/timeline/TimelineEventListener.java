package com.tourtravel.crm.timeline;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * Persists {@link EntityActivityEvent}s into the shared timeline log. Listening
 * AFTER_COMMIT means a rolled-back create/update never leaves a phantom timeline entry.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class TimelineEventListener {

    private final TimelineEventRepository timelineEventRepository;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onEntityActivity(EntityActivityEvent event) {
        TimelineEvent entry = TimelineEvent.builder()
                .entityType(event.getEntityType())
                .entityId(event.getEntityId())
                .eventType(event.getEventType())
                .description(event.getDescription())
                .performedByName(event.getPerformedByName())
                .build();

        timelineEventRepository.save(entry);
        log.debug("Timeline event recorded: {} for {}#{}", event.getEventType(), event.getEntityType(), event.getEntityId());
    }
}
