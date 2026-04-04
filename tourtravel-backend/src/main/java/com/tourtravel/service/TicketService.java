package com.tourtravel.service;

import com.tourtravel.dto.request.TicketRequest;
import com.tourtravel.dto.response.TicketResponse;
import com.tourtravel.entity.Ticket;
import com.tourtravel.exception.ResourceNotFoundException;
import com.tourtravel.mapper.TicketMapper;
import com.tourtravel.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TicketMapper ticketMapper;

    @Transactional(readOnly = true)
    public Page<TicketResponse> getAllTickets(Pageable pageable) {
        return ticketRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(ticketMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public TicketResponse getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", id));
        return ticketMapper.toResponse(ticket);
    }

    @Transactional
    public TicketResponse createTicket(TicketRequest request) {
        Ticket ticket = ticketMapper.toEntity(request);
        return ticketMapper.toResponse(ticketRepository.save(ticket));
    }

    @Transactional
    public TicketResponse updateTicket(Long id, TicketRequest request) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", id));
        ticketMapper.updateEntityFromRequest(request, ticket);
        return ticketMapper.toResponse(ticketRepository.save(ticket));
    }

    @Transactional
    public void deleteTicket(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", id));
        ticketRepository.delete(ticket);
    }
}
