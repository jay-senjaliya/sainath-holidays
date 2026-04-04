package com.tourtravel.service;

import com.tourtravel.dto.request.EnquiryRequest;
import com.tourtravel.dto.request.EnquiryStatusUpdate;
import com.tourtravel.dto.response.EnquiryResponse;
import com.tourtravel.entity.Enquiry;
import com.tourtravel.entity.Enquiry.EnquiryStatus;
import com.tourtravel.entity.TourPackage;
import com.tourtravel.entity.User;
import com.tourtravel.exception.BadRequestException;
import com.tourtravel.exception.ResourceNotFoundException;
import com.tourtravel.mapper.EnquiryMapper;
import com.tourtravel.repository.EnquiryRepository;
import com.tourtravel.repository.PackageRepository;
import com.tourtravel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class EnquiryService {

    private final EnquiryRepository enquiryRepository;
    private final PackageRepository packageRepository;
    private final UserRepository    userRepository;
    private final EnquiryMapper     enquiryMapper;
    private final MailService       mailService;

    // ---- USER APIS ----

    @Transactional
    public EnquiryResponse createEnquiry(String userEmail, EnquiryRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .or(() -> userRepository.findByPhone(userEmail))
                .orElseThrow(() -> new ResourceNotFoundException("User", "email/phone", userEmail));

        Enquiry enquiry = enquiryMapper.toEntity(request);
        enquiry.setUser(user);

        // Link package if present and if service type is PACKAGE
        if (request.getServiceType() == Enquiry.ServiceType.PACKAGE) {
            if (request.getPackageId() == null) {
                throw new BadRequestException("packageId is required when serviceType is PACKAGE");
            }
            TourPackage pkg = packageRepository.findByIdAndActiveTrue(request.getPackageId())
                    .orElseThrow(() -> new ResourceNotFoundException("TourPackage", "id", request.getPackageId()));
            enquiry.setTourPackage(pkg);
        } else if (request.getPackageId() != null) {
            throw new BadRequestException("packageId must be null if serviceType is not PACKAGE");
        }

        Enquiry saved = enquiryRepository.save(enquiry);
        log.info("User {} created enquiry ID {} for type {}", userEmail, saved.getId(), saved.getServiceType());
        
        // Notify Admin or User? For now, let's log that we would send an email
        try {
            String subject = "New Enquiry Received: " + saved.getServiceType();
            String body = "Hello,\n\nA new enquiry has been received from " + userEmail + ".\n\n" +
                          "Details: " + saved.getMessage() + "\n\n" +
                          "Manage this at: http://localhost:5173/admin/enquiries";
            mailService.sendEmail("sainathholidays@gmail.com", subject, body); // Sample admin email
        } catch (Exception e) {
            log.warn("Failed to trigger enquiry email notification: {}", e.getMessage());
        }

        return enquiryMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public Page<EnquiryResponse> getUserEnquiries(String userEmail, Pageable pageable) {
        User user = userRepository.findByEmail(userEmail)
                .or(() -> userRepository.findByPhone(userEmail))
                .orElseThrow(() -> new ResourceNotFoundException("User", "email/phone", userEmail));

        return enquiryRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable)
                .map(enquiryMapper::toResponse);
    }

    // ---- ADMIN APIS ----

    @Transactional(readOnly = true)
    public Page<EnquiryResponse> getAllEnquiries(EnquiryStatus status, Pageable pageable) {
        Page<Enquiry> pageResult = (status != null)
                ? enquiryRepository.findByStatusOrderByCreatedAtDesc(status, pageable)
                : enquiryRepository.findAllByOrderByCreatedAtDesc(pageable);

        return pageResult.map(enquiryMapper::toResponse);
    }

    @Transactional
    public EnquiryResponse updateStatus(Long id, EnquiryStatusUpdate request) {
        Enquiry existing = enquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enquiry", "id", id));

        EnquiryStatus newStatus = EnquiryStatus.valueOf(request.getStatus().toUpperCase());
        
        // If moving to RESOLVED, set resolvedAt timestamp
        if (existing.getStatus() == EnquiryStatus.PENDING && newStatus == EnquiryStatus.RESOLVED) {
            existing.setResolvedAt(LocalDateTime.now());
        } else if (newStatus == EnquiryStatus.PENDING) {
            // Un-resolving edge case
            existing.setResolvedAt(null);
        }

        existing.setStatus(newStatus);
        
        if (request.getAdminNotes() != null) {
            existing.setAdminNotes(request.getAdminNotes());
        }

        Enquiry updated = enquiryRepository.save(existing);
        log.info("Admin updated enquiry ID {} to status {}", id, newStatus);
        
        return enquiryMapper.toResponse(updated);
    }
}
