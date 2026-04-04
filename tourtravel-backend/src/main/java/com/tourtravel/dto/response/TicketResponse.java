package com.tourtravel.dto.response;

import com.tourtravel.entity.Ticket.TicketType;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TicketResponse {
    private Long id;
    private TicketType type;
    private String origin;
    private String destination;
    private String description;
    private LocalDateTime createdAt;
}
