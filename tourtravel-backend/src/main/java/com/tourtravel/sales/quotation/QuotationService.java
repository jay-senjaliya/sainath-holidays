package com.tourtravel.sales.quotation;

import com.tourtravel.crm.customer.Customer;
import com.tourtravel.crm.customer.CustomerRepository;
import com.tourtravel.crm.timeline.EntityActivityEvent;
import com.tourtravel.crm.timeline.TimelineEvent;
import com.tourtravel.entity.Hotel;
import com.tourtravel.entity.TourPackage;
import com.tourtravel.entity.User;
import com.tourtravel.entity.Vehicle;
import com.tourtravel.exception.BadRequestException;
import com.tourtravel.exception.ResourceNotFoundException;
import com.tourtravel.repository.HotelRepository;
import com.tourtravel.repository.PackageRepository;
import com.tourtravel.repository.UserRepository;
import com.tourtravel.repository.VehicleRepository;
import com.tourtravel.sales.quotation.Quotation.ApprovalStatus;
import com.tourtravel.sales.quotation.Quotation.QuotationStatus;
import com.tourtravel.sales.quotation.dto.QuotationDetailResponse;
import com.tourtravel.sales.quotation.dto.QuotationListResponse;
import com.tourtravel.sales.quotation.dto.QuotationRequest;
import com.tourtravel.sales.quotation.dto.QuotationRequest.QuotationItemRequest;
import com.tourtravel.sales.quotation.dto.WhatsAppLinkResponse;
import com.tourtravel.service.MailService;
import com.tourtravel.settings.CompanySettingsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Quotation lifecycle events are published against the owning Customer's timeline
 * (entityType=CUSTOMER), exactly like LeadService — there's no Quotation-specific
 * timeline UI, so a parallel unread trail would just be dead data. Same generic
 * crm.timeline mechanism, reused by a Sales-module service.
 *
 * Phase 2 pricing engine: resolveItems() builds and prices each line (validating
 * catalog references, snapshotting names, computing subtotals server-side —
 * never trusting client-submitted subtotals); applyPricingEngine() then either
 * derives totalAmount/finalAmount from those items, or — if there are none —
 * falls back to Phase 1's manual-entry behavior unchanged.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class QuotationService {

    private final QuotationRepository quotationRepository;
    private final CustomerRepository customerRepository;
    private final PackageRepository packageRepository;
    private final HotelRepository hotelRepository;
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    private final QuotationMapper quotationMapper;
    private final ApplicationEventPublisher eventPublisher;
    private final QuotationPdfService quotationPdfService;
    private final CompanySettingsService companySettingsService;
    private final MailService mailService;

    @Transactional(readOnly = true)
    public Page<QuotationListResponse> getAllQuotations(String search, QuotationStatus status, Long customerId,
                                                          Long packageId, Boolean active, Pageable pageable) {
        return quotationRepository.searchQuotations(search, status, customerId, packageId, active, pageable)
                .map(quotationMapper::toListResponse);
    }

    @Transactional(readOnly = true)
    public QuotationDetailResponse getQuotationById(Long id) {
        return quotationMapper.toDetailResponse(findQuotation(id));
    }

    @Transactional
    public QuotationDetailResponse createQuotation(QuotationRequest request, String adminEmail) {
        User admin = findAdmin(adminEmail);
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", request.getCustomerId()));

        Quotation quotation = quotationMapper.toEntity(request);
        quotation.setCustomer(customer);
        quotation.setTourPackage(resolvePackage(request.getPackageId()));
        quotation.setStatus(QuotationStatus.DRAFT);
        quotation.setCreatedBy(admin);

        quotation.getItems().addAll(resolveItems(request.getItems(), quotation));
        applyPricingEngine(quotation, request);
        applyApprovalGate(quotation);

        // Two-step save: the human-readable number depends on the generated id.
        Quotation saved = quotationRepository.save(quotation);
        saved.setQuotationNumber(formatQuotationNumber(saved.getId()));
        saved = quotationRepository.save(saved);

        log.info("Admin {} created quotation {} for customer ID {}", adminEmail, saved.getQuotationNumber(), customer.getId());

        publishCustomerActivity(customer.getId(), "QUOTATION_CREATED",
                String.format("New quotation %s created (%.2f)", saved.getQuotationNumber(), saved.getFinalAmount()),
                admin.getName());

        return quotationMapper.toDetailResponse(saved);
    }

    @Transactional
    public QuotationDetailResponse updateQuotation(Long id, QuotationRequest request, String adminEmail) {
        Quotation existing = findQuotation(id);
        User admin = findAdmin(adminEmail);

        if (!existing.getCustomer().getId().equals(request.getCustomerId())) {
            Customer newCustomer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", request.getCustomerId()));
            existing.setCustomer(newCustomer);
        }

        quotationMapper.updateEntityFromRequest(request, existing);
        existing.setTourPackage(resolvePackage(request.getPackageId()));

        // Replace-all semantics for the item collection — same convention as
        // PackageService.updatePackage's handling of itineraries/images.
        existing.getItems().clear();
        existing.getItems().addAll(resolveItems(request.getItems(), existing));
        applyPricingEngine(existing, request);
        applyApprovalGate(existing);

        Quotation updated = quotationRepository.save(existing);
        log.info("Admin {} updated quotation {}", adminEmail, updated.getQuotationNumber());

        publishCustomerActivity(updated.getCustomer().getId(), "QUOTATION_UPDATED",
                String.format("Quotation %s updated", updated.getQuotationNumber()), admin.getName());

        return quotationMapper.toDetailResponse(updated);
    }

    @Transactional
    public QuotationDetailResponse updateStatus(Long id, QuotationStatus newStatus, String adminEmail) {
        Quotation existing = findQuotation(id);
        User admin = findAdmin(adminEmail);
        QuotationStatus previousStatus = existing.getStatus();

        existing.setStatus(newStatus);
        Quotation updated = quotationRepository.save(existing);
        log.info("Admin {} moved quotation {} from {} to {}", adminEmail, updated.getQuotationNumber(), previousStatus, newStatus);

        publishCustomerActivity(updated.getCustomer().getId(), "QUOTATION_STATUS_CHANGED",
                String.format("Quotation %s status changed from %s to %s", updated.getQuotationNumber(), previousStatus, newStatus),
                admin.getName());

        return quotationMapper.toDetailResponse(updated);
    }

    @Transactional
    public void deactivateQuotation(Long id, String adminEmail) {
        Quotation existing = findQuotation(id);
        User admin = findAdmin(adminEmail);

        existing.setActive(false);
        quotationRepository.save(existing);
        log.info("Admin {} deactivated quotation {}", adminEmail, existing.getQuotationNumber());

        publishCustomerActivity(existing.getCustomer().getId(), "QUOTATION_DEACTIVATED",
                String.format("Quotation %s deactivated", existing.getQuotationNumber()), admin.getName());
    }

    // ---- Phase 3: PDF ----

    @Transactional(readOnly = true)
    public byte[] generatePdf(Long id) {
        return quotationPdfService.generatePdf(findQuotation(id));
    }

    /** Used only by the public QuotationShareController — no admin auth involved. */
    @Transactional(readOnly = true)
    public byte[] generatePdfForShareToken(String shareToken) {
        Quotation quotation = quotationRepository.findByShareTokenAndActiveTrue(shareToken)
                .orElseThrow(() -> new ResourceNotFoundException("Quotation", "shareToken", shareToken));
        return quotationPdfService.generatePdf(quotation);
    }

    // ---- Phase 4: send via email / WhatsApp, approval ----

    @Transactional
    public void sendQuotationEmail(Long id, String adminEmail) {
        Quotation quotation = findQuotation(id);
        User admin = findAdmin(adminEmail);
        requireNotPendingApproval(quotation);

        String customerEmail = quotation.getCustomer().getEmail();
        if (customerEmail == null || customerEmail.isBlank()) {
            throw new BadRequestException("This customer has no email address on file");
        }

        byte[] pdf = quotationPdfService.generatePdf(quotation);
        String subject = "Your Quotation " + quotation.getQuotationNumber();
        String body = String.format(
                "Dear %s,%n%nPlease find attached your travel quotation %s (final amount: %s).%n" +
                        "This quotation is valid until %s.%n%nLooking forward to planning your trip!",
                quotation.getCustomer().getName(), quotation.getQuotationNumber(),
                quotation.getFinalAmount(), quotation.getValidUntil());

        try {
            mailService.sendEmailWithAttachment(customerEmail, subject, body, pdf, quotation.getQuotationNumber() + ".pdf");
        } catch (Exception e) {
            log.error("Failed to email quotation {} to {}: {}", quotation.getQuotationNumber(), customerEmail, e.getMessage());
            throw new BadRequestException("Failed to send email: " + e.getMessage());
        }

        if (quotation.getStatus() == QuotationStatus.DRAFT) {
            quotation.setStatus(QuotationStatus.SENT);
        }
        quotationRepository.save(quotation);

        publishCustomerActivity(quotation.getCustomer().getId(), "QUOTATION_EMAILED",
                String.format("Quotation %s emailed to %s", quotation.getQuotationNumber(), customerEmail), admin.getName());
    }

    /**
     * No WhatsApp Business API — builds a wa.me deep link with a pre-filled
     * message + a public, token-gated PDF link. The admin still has to open
     * WhatsApp and hit send themselves; nothing is sent automatically.
     */
    @Transactional
    public WhatsAppLinkResponse generateWhatsAppLink(Long id, String adminEmail) {
        Quotation quotation = findQuotation(id);
        findAdmin(adminEmail); // validates the caller is a real admin, same as every other action here
        requireNotPendingApproval(quotation);

        if (quotation.getShareToken() == null) {
            quotation.setShareToken(UUID.randomUUID().toString());
            quotation = quotationRepository.save(quotation);
        }

        String shareUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/v1/quotations/shared/{token}/pdf")
                .buildAndExpand(quotation.getShareToken())
                .toUriString();

        String message = String.format(
                "Hi %s! Here's your travel quotation %s (final amount: %s), valid until %s: %s",
                quotation.getCustomer().getName(), quotation.getQuotationNumber(),
                quotation.getFinalAmount(), quotation.getValidUntil(), shareUrl);

        String waLink = "https://wa.me/" + normalizePhoneForWhatsApp(quotation.getCustomer().getPhone())
                + "?text=" + URLEncoder.encode(message, StandardCharsets.UTF_8);

        return WhatsAppLinkResponse.builder().waLink(waLink).shareUrl(shareUrl).build();
    }

    @Transactional
    public QuotationDetailResponse updateApproval(Long id, ApprovalStatus newStatus, String adminEmail) {
        Quotation quotation = findQuotation(id);
        User admin = findAdmin(adminEmail);

        if (quotation.getApprovalStatus() != ApprovalStatus.PENDING) {
            throw new BadRequestException("This quotation does not require approval");
        }
        if (newStatus != ApprovalStatus.APPROVED && newStatus != ApprovalStatus.REJECTED) {
            throw new BadRequestException("Approval status must be APPROVED or REJECTED");
        }

        quotation.setApprovalStatus(newStatus);
        quotation.setApprovedBy(admin);
        quotation.setApprovedAt(java.time.LocalDateTime.now());
        Quotation updated = quotationRepository.save(quotation);

        publishCustomerActivity(updated.getCustomer().getId(),
                newStatus == ApprovalStatus.APPROVED ? "QUOTATION_APPROVED" : "QUOTATION_APPROVAL_REJECTED",
                String.format("Quotation %s discount %s by %s", updated.getQuotationNumber(),
                        newStatus == ApprovalStatus.APPROVED ? "approved" : "rejected", admin.getName()),
                admin.getName());

        return quotationMapper.toDetailResponse(updated);
    }

    private void requireNotPendingApproval(Quotation quotation) {
        if (quotation.getApprovalStatus() == ApprovalStatus.PENDING) {
            throw new BadRequestException("This quotation's discount requires approval before it can be sent");
        }
    }

    /** wa.me requires digits only, with country code and no leading '+'. Defaults
     *  a bare 10-digit number to India (+91) — a reasonable default, not a hard rule,
     *  given this is an India-first product (see docs/02_PRODUCT.md). */
    private String normalizePhoneForWhatsApp(String phone) {
        String digitsOnly = phone == null ? "" : phone.replaceAll("[^0-9]", "");
        if (digitsOnly.length() == 10) {
            return "91" + digitsOnly;
        }
        return digitsOnly;
    }

    // ---- Phase 2: line items & pricing engine ----

    private List<QuotationItem> resolveItems(List<QuotationItemRequest> itemRequests, Quotation quotation) {
        List<QuotationItem> items = new ArrayList<>();
        if (itemRequests == null) {
            return items;
        }

        int order = 0;
        for (QuotationItemRequest itemRequest : itemRequests) {
            QuotationItem item = new QuotationItem();
            item.setQuotation(quotation);
            item.setItemType(itemRequest.getItemType());
            item.setQuantity(itemRequest.getQuantity());
            item.setUnitPrice(itemRequest.getUnitPrice());
            item.setNotes(itemRequest.getNotes());
            item.setDisplayOrder(order++);

            switch (itemRequest.getItemType()) {
                case PACKAGE -> {
                    TourPackage pkg = packageRepository.findById(requireReferenceId(itemRequest))
                            .orElseThrow(() -> new ResourceNotFoundException("TourPackage", "id", itemRequest.getReferenceId()));
                    item.setReferenceId(pkg.getId());
                    item.setItemName(pkg.getTitle());
                }
                case HOTEL -> {
                    Hotel hotel = hotelRepository.findById(requireReferenceId(itemRequest))
                            .orElseThrow(() -> new ResourceNotFoundException("Hotel", "id", itemRequest.getReferenceId()));
                    item.setReferenceId(hotel.getId());
                    item.setItemName(hotel.getName());
                }
                case VEHICLE -> {
                    Vehicle vehicle = vehicleRepository.findById(requireReferenceId(itemRequest))
                            .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", itemRequest.getReferenceId()));
                    item.setReferenceId(vehicle.getId());
                    item.setItemName(vehicle.getName());
                }
                case ACTIVITY -> {
                    if (itemRequest.getItemName() == null || itemRequest.getItemName().isBlank()) {
                        throw new BadRequestException("Activity line items require a name");
                    }
                    item.setReferenceId(null);
                    item.setItemName(itemRequest.getItemName());
                }
            }

            item.setSubtotal(itemRequest.getUnitPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity())));
            items.add(item);
        }
        return items;
    }

    private Long requireReferenceId(QuotationItemRequest itemRequest) {
        if (itemRequest.getReferenceId() == null) {
            throw new BadRequestException(itemRequest.getItemType() + " line items require a catalog selection");
        }
        return itemRequest.getReferenceId();
    }

    /**
     * Items present -> totalAmount/finalAmount are computed here, authoritatively;
     * whatever the client sent for those two fields is discarded. Items empty ->
     * exactly Phase 1: the mapper already copied the client's manually-entered
     * values onto the entity, so this just validates they were actually provided.
     */
    private void applyPricingEngine(Quotation quotation, QuotationRequest request) {
        BigDecimal discount = request.getDiscount() != null ? request.getDiscount() : BigDecimal.ZERO;

        if (!quotation.getItems().isEmpty()) {
            BigDecimal computedTotal = quotation.getItems().stream()
                    .map(QuotationItem::getSubtotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            quotation.setTotalAmount(computedTotal);
            quotation.setDiscount(discount);
            quotation.setFinalAmount(computedTotal.subtract(discount).max(BigDecimal.ZERO));
        } else {
            if (request.getTotalAmount() == null || request.getFinalAmount() == null) {
                throw new BadRequestException("Total amount and final amount are required when no line items are added");
            }
            quotation.setTotalAmount(request.getTotalAmount());
            quotation.setDiscount(discount);
            quotation.setFinalAmount(request.getFinalAmount());
        }
    }

    /**
     * Recomputed on every create/update from the current discount — always
     * resets to PENDING (even if previously APPROVED) once the threshold is
     * crossed, since an edit can materially change what's being approved.
     * See Quotation.ApprovalStatus javadoc for why this isn't a real
     * access-control gate yet.
     */
    private void applyApprovalGate(Quotation quotation) {
        BigDecimal threshold = companySettingsService.getApprovalDiscountThreshold();
        boolean requiresApproval = threshold != null && quotation.getDiscount().compareTo(threshold) >= 0;

        if (requiresApproval) {
            quotation.setApprovalStatus(ApprovalStatus.PENDING);
            quotation.setApprovedBy(null);
            quotation.setApprovedAt(null);
        } else {
            quotation.setApprovalStatus(ApprovalStatus.NOT_REQUIRED);
            quotation.setApprovedBy(null);
            quotation.setApprovedAt(null);
        }
    }

    // ---- helpers ----

    private Quotation findQuotation(Long id) {
        return quotationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quotation", "id", id));
    }

    private User findAdmin(String adminEmail) {
        return userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", adminEmail));
    }

    private TourPackage resolvePackage(Long packageId) {
        if (packageId == null) {
            return null;
        }
        return packageRepository.findById(packageId)
                .orElseThrow(() -> new ResourceNotFoundException("TourPackage", "id", packageId));
    }

    private String formatQuotationNumber(Long id) {
        return String.format("QUO-%06d", id);
    }

    private void publishCustomerActivity(Long customerId, String eventType, String description, String performedByName) {
        eventPublisher.publishEvent(new EntityActivityEvent(
                TimelineEvent.EntityType.CUSTOMER, customerId, eventType, description, performedByName));
    }
}
