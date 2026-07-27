package com.tourtravel.crm.timeline;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TimelineEventRepository extends JpaRepository<TimelineEvent, Long> {

    Page<TimelineEvent> findByEntityTypeAndEntityIdOrderByCreatedAtDesc(
            TimelineEvent.EntityType entityType, Long entityId, Pageable pageable);
}
