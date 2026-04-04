package com.tourtravel.controller;

import com.tourtravel.dto.response.ApiResponse;
import com.tourtravel.dto.response.TicketResponse;
import com.tourtravel.service.TicketService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tickets")
@RequiredArgsConstructor
@Tag(name = "Public - Tickets", description = "Public endpoints for ticket routes browsing")
public class TicketController {

    private final TicketService ticketService;

    @GetMapping
    @Operation(summary = "Get list of generic ticket routes/options")
    public ResponseEntity<ApiResponse<Page<TicketResponse>>> getAllTickets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.ok("Tickets fetched successfully", ticketService.getAllTickets(pageable)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get ticket details by ID")
    public ResponseEntity<ApiResponse<TicketResponse>> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Ticket details fetched successfully", ticketService.getTicketById(id)));
    }
}
