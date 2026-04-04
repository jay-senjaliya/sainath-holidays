package com.tourtravel.dto.request;

import com.tourtravel.entity.Ticket.TicketType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TicketRequest {

    @NotNull(message = "Ticket type is required")
    private TicketType type;

    @NotBlank(message = "Origin is required")
    private String origin;

    @NotBlank(message = "Destination is required")
    private String destination;

    private String description;
}
