package com.tourtravel.crm.customer;

import com.tourtravel.crm.customer.dto.CustomerDetailResponse;
import com.tourtravel.crm.customer.dto.CustomerListResponse;
import com.tourtravel.crm.customer.dto.CustomerRequest;
import com.tourtravel.crm.customer.dto.TimelineEventResponse;
import com.tourtravel.crm.timeline.EntityActivityEvent;
import com.tourtravel.crm.timeline.TimelineEvent;
import com.tourtravel.crm.timeline.TimelineEventRepository;
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

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final CustomerMapper customerMapper;
    private final TimelineEventRepository timelineEventRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional(readOnly = true)
    public Page<CustomerListResponse> getAllCustomers(String search, Customer.CustomerSource source,
                                                        String city, Boolean active, Pageable pageable) {
        return customerRepository.searchCustomers(search, source, city, active, pageable)
                .map(customerMapper::toListResponse);
    }

    @Transactional(readOnly = true)
    public CustomerDetailResponse getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", id));
        return customerMapper.toDetailResponse(customer);
    }

    @Transactional
    public CustomerDetailResponse createCustomer(CustomerRequest request, String adminEmail) {
        User admin = findAdmin(adminEmail);

        Customer customer = customerMapper.toEntity(request);
        customer.setCreatedBy(admin);
        resolveLinkedUser(request, customer);

        Customer saved = customerRepository.save(customer);
        log.info("Admin {} created customer ID {}", adminEmail, saved.getId());

        eventPublisher.publishEvent(new EntityActivityEvent(
                TimelineEvent.EntityType.CUSTOMER, saved.getId(),
                "CUSTOMER_CREATED", "Customer profile created", admin.getName()));

        return customerMapper.toDetailResponse(saved);
    }

    @Transactional
    public CustomerDetailResponse updateCustomer(Long id, CustomerRequest request, String adminEmail) {
        Customer existing = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", id));
        User admin = findAdmin(adminEmail);

        customerMapper.updateEntityFromRequest(request, existing);
        resolveLinkedUser(request, existing);

        Customer updated = customerRepository.save(existing);
        log.info("Admin {} updated customer ID {}", adminEmail, id);

        eventPublisher.publishEvent(new EntityActivityEvent(
                TimelineEvent.EntityType.CUSTOMER, updated.getId(),
                "CUSTOMER_UPDATED", "Customer profile updated", admin.getName()));

        return customerMapper.toDetailResponse(updated);
    }

    @Transactional
    public void deactivateCustomer(Long id, String adminEmail) {
        Customer existing = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", id));
        User admin = findAdmin(adminEmail);

        existing.setActive(false);
        customerRepository.save(existing);
        log.info("Admin {} deactivated customer ID {}", adminEmail, id);

        eventPublisher.publishEvent(new EntityActivityEvent(
                TimelineEvent.EntityType.CUSTOMER, id,
                "CUSTOMER_DEACTIVATED", "Customer deactivated", admin.getName()));
    }

    @Transactional(readOnly = true)
    public Page<TimelineEventResponse> getCustomerTimeline(Long customerId, Pageable pageable) {
        if (!customerRepository.existsById(customerId)) {
            throw new ResourceNotFoundException("Customer", "id", customerId);
        }

        return timelineEventRepository
                .findByEntityTypeAndEntityIdOrderByCreatedAtDesc(TimelineEvent.EntityType.CUSTOMER, customerId, pageable)
                .map(event -> TimelineEventResponse.builder()
                        .id(event.getId())
                        .eventType(event.getEventType())
                        .description(event.getDescription())
                        .performedByName(event.getPerformedByName())
                        .createdAt(event.getCreatedAt())
                        .build());
    }

    // ---- helpers ----

    private User findAdmin(String adminEmail) {
        return userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", adminEmail));
    }

    private void resolveLinkedUser(CustomerRequest request, Customer customer) {
        if (request.getLinkedUserId() == null) {
            customer.setLinkedUser(null);
            return;
        }
        User linked = userRepository.findById(request.getLinkedUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getLinkedUserId()));
        customer.setLinkedUser(linked);
    }
}
