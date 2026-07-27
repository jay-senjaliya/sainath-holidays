package com.tourtravel.crm.customer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * A single entry in a customer's activity timeline.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimelineEventResponse {

    private Long id;
    private String eventType;
    private String description;
    private String performedByName;
    private LocalDateTime createdAt;
}
