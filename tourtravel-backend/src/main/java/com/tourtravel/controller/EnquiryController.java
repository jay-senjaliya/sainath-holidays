package com.tourtravel.controller;

import com.tourtravel.dto.request.EnquiryRequest;
import com.tourtravel.dto.response.ApiResponse;
import com.tourtravel.dto.response.EnquiryResponse;
import com.tourtravel.service.EnquiryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * Endpoints for Enquiries.
 * All endpoints here require authentication. Admin views are housed under AdminController.
 */
@RestController
@RequestMapping("/api/v1/enquiries")
@RequiredArgsConstructor
@Tag(name = "User - Enquiries", description = "For authenticated users to submit/view their enquiries and tickets")
@SecurityRequirement(name = "bearerAuth")
public class EnquiryController {

    private final EnquiryService enquiryService;

    @PostMapping
    @Operation(summary = "Submit a new enquiry (for Package, Hotel, Vehicle, or standalone Ticket)")
    public ResponseEntity<ApiResponse<EnquiryResponse>> createEnquiry(
            @Valid @RequestBody EnquiryRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        EnquiryResponse response = enquiryService.createEnquiry(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Enquiry submitted successfully", response));
    }

    @GetMapping("/my")
    @Operation(summary = "Get a chronological list of enquiries submitted by the current user")
    public ResponseEntity<ApiResponse<Page<EnquiryResponse>>> getMyEnquiries(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails userDetails) {

        Pageable pageable = PageRequest.of(page, size);
        Page<EnquiryResponse> response = enquiryService.getUserEnquiries(userDetails.getUsername(), pageable);
        
        return ResponseEntity.ok(ApiResponse.ok("User enquiries fetched successfully", response));
    }
}
