package com.tourtravel.crm.lead;

import com.tourtravel.crm.customer.Customer;
import com.tourtravel.crm.customer.CustomerRepository;
import com.tourtravel.crm.lead.Lead.LeadStatus;
import com.tourtravel.crm.lead.dto.LeadDetailResponse;
import com.tourtravel.crm.lead.dto.LeadListResponse;
import com.tourtravel.crm.lead.dto.LeadRequest;
import com.tourtravel.crm.timeline.EntityActivityEvent;
import com.tourtravel.crm.timeline.TimelineEvent;
import com.tourtravel.entity.User;
import com.tourtravel.exception.ResourceNotFoundException;
import com.tourtravel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

/**
 * Lead lifecycle events are published against the owning Customer's timeline
 * (entityType=CUSTOMER, entityId=customer.getId()) rather than a Lead-specific
 * timeline — there's no Lead detail/timeline UI yet, so a parallel unread trail
 * would just be dead data. This is exactly the cross-module reuse the generic
 * TimelineEvent/EntityActivityEvent design (see crm.timeline) was built for.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class LeadService {

    private final LeadRepository leadRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final LeadMapper leadMapper;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional(readOnly = true)
    public Page<LeadListResponse> getAllLeads(String search, LeadStatus status, Customer.CustomerSource source,
                                                Long customerId, Long assignedToId, Boolean active, Pageable pageable) {
        return leadRepository.searchLeads(search, status, source, customerId, assignedToId, active, pageable)
                .map(leadMapper::toListResponse);
    }

    @Transactional(readOnly = true)
    public LeadDetailResponse getLeadById(Long id) {
        return leadMapper.toDetailResponse(findLead(id));
    }

    @Transactional(readOnly = true)
    public Map<LeadStatus, List<LeadListResponse>> getPipeline() {
        Map<LeadStatus, List<LeadListResponse>> pipeline = new EnumMap<>(LeadStatus.class);
        for (LeadStatus status : LeadStatus.values()) {
            pipeline.put(status, new ArrayList<>());
        }
        leadRepository.findByActiveTrueOrderByCreatedAtDesc().forEach(lead ->
                pipeline.get(lead.getStatus()).add(leadMapper.toListResponse(lead)));
        return pipeline;
    }

    @Transactional
    public LeadDetailResponse createLead(LeadRequest request, String adminEmail) {
        User admin = findAdmin(adminEmail);
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", request.getCustomerId()));

        Lead lead = leadMapper.toEntity(request);
        lead.setCustomer(customer);
        lead.setStatus(LeadStatus.NEW);
        lead.setCreatedBy(admin);
        resolveAssignedTo(request.getAssignedToId(), lead);

        Lead saved = leadRepository.save(lead);
        log.info("Admin {} created lead ID {} for customer ID {}", adminEmail, saved.getId(), customer.getId());

        publishCustomerActivity(customer.getId(), "LEAD_CREATED",
                String.format("New lead created: %s (source: %s)", truncate(request.getRequirement()), request.getSource()),
                admin.getName());

        return leadMapper.toDetailResponse(saved);
    }

    @Transactional
    public LeadDetailResponse updateLead(Long id, LeadRequest request, String adminEmail) {
        Lead existing = findLead(id);
        User admin = findAdmin(adminEmail);

        if (!existing.getCustomer().getId().equals(request.getCustomerId())) {
            Customer newCustomer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", request.getCustomerId()));
            existing.setCustomer(newCustomer);
        }

        leadMapper.updateEntityFromRequest(request, existing);
        resolveAssignedTo(request.getAssignedToId(), existing);

        Lead updated = leadRepository.save(existing);
        log.info("Admin {} updated lead ID {}", adminEmail, id);

        publishCustomerActivity(updated.getCustomer().getId(), "LEAD_UPDATED",
                String.format("Lead updated: %s", truncate(request.getRequirement())), admin.getName());

        return leadMapper.toDetailResponse(updated);
    }

    @Transactional
    public LeadDetailResponse updateStatus(Long id, LeadStatus newStatus, String adminEmail) {
        Lead existing = findLead(id);
        User admin = findAdmin(adminEmail);
        LeadStatus previousStatus = existing.getStatus();

        existing.setStatus(newStatus);
        Lead updated = leadRepository.save(existing);
        log.info("Admin {} moved lead ID {} from {} to {}", adminEmail, id, previousStatus, newStatus);

        publishCustomerActivity(updated.getCustomer().getId(), "LEAD_STATUS_CHANGED",
                String.format("Lead status changed from %s to %s", previousStatus, newStatus), admin.getName());

        return leadMapper.toDetailResponse(updated);
    }

    @Transactional
    public LeadDetailResponse assignLead(Long id, Long assignedToId, String adminEmail) {
        Lead existing = findLead(id);
        User admin = findAdmin(adminEmail);

        resolveAssignedTo(assignedToId, existing);
        Lead updated = leadRepository.save(existing);

        String description = updated.getAssignedTo() != null
                ? String.format("Lead assigned to %s", updated.getAssignedTo().getName())
                : "Lead unassigned";
        log.info("Admin {} {} for lead ID {}", adminEmail, description, id);

        publishCustomerActivity(updated.getCustomer().getId(), "LEAD_ASSIGNED", description, admin.getName());

        return leadMapper.toDetailResponse(updated);
    }

    @Transactional
    public void deactivateLead(Long id, String adminEmail) {
        Lead existing = findLead(id);
        User admin = findAdmin(adminEmail);

        existing.setActive(false);
        leadRepository.save(existing);
        log.info("Admin {} deactivated lead ID {}", adminEmail, id);

        publishCustomerActivity(existing.getCustomer().getId(), "LEAD_DEACTIVATED", "Lead deactivated", admin.getName());
    }

    // ---- helpers ----

    private Lead findLead(Long id) {
        return leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", id));
    }

    private User findAdmin(String adminEmail) {
        return userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", adminEmail));
    }

    private void resolveAssignedTo(Long assignedToId, Lead lead) {
        if (assignedToId == null) {
            lead.setAssignedTo(null);
            return;
        }
        User assignee = userRepository.findById(assignedToId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", assignedToId));
        lead.setAssignedTo(assignee);
    }

    private void publishCustomerActivity(Long customerId, String eventType, String description, String performedByName) {
        eventPublisher.publishEvent(new EntityActivityEvent(
                TimelineEvent.EntityType.CUSTOMER, customerId, eventType, description, performedByName));
    }

    private String truncate(String text) {
        if (text == null) return "";
        return text.length() > 80 ? text.substring(0, 80) + "..." : text;
    }
}
