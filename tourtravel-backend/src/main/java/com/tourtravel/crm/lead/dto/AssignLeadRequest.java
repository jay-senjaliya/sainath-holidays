package com.tourtravel.crm.lead.dto;

import lombok.Data;

/**
 * assignedToId is deliberately nullable — sending null unassigns the lead.
 */
@Data
public class AssignLeadRequest {

    private Long assignedToId;
}
