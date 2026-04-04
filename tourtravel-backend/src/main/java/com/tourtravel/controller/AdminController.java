package com.tourtravel.controller;

import com.tourtravel.dto.request.EnquiryStatusUpdate;
import com.tourtravel.dto.request.HotelRequest;
import com.tourtravel.dto.request.PackageRequest;
import com.tourtravel.dto.request.VehicleRequest;
import com.tourtravel.dto.request.TicketRequest;
import com.tourtravel.dto.response.*;
import com.tourtravel.entity.Enquiry.EnquiryStatus;
import com.tourtravel.service.EnquiryService;
import com.tourtravel.service.HotelService;
import com.tourtravel.service.PackageService;
import com.tourtravel.service.VehicleService;
import com.tourtravel.service.TicketService;
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
 * Single centralized Admin controller for all CMS features.
 * Protected by Spring Security Role checks ("ROLE_ADMIN") in SecurityConfig.
 */
@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Tag(name = "Admin CMS", description = "Admin operations for Packages, Vehicles, Hotels, and Enquiries")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final PackageService packageService;
    private final VehicleService vehicleService;
    private final HotelService   hotelService;
    private final EnquiryService enquiryService;
    private final TicketService  ticketService;

    // ==========================================
    // TOUR PACKAGES
    // ==========================================

    @PostMapping("/packages")
    @Operation(summary = "Create a new tour package")
    public ResponseEntity<ApiResponse<PackageDetailResponse>> createPackage(
            @Valid @RequestBody PackageRequest request,
            @AuthenticationPrincipal UserDetails admin) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Package created", packageService.createPackage(request, admin.getUsername())));
    }

    @PutMapping("/packages/{id}")
    @Operation(summary = "Update an existing tour package")
    public ResponseEntity<ApiResponse<PackageDetailResponse>> updatePackage(
            @PathVariable Long id, @Valid @RequestBody PackageRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Package updated", packageService.updatePackage(id, request)));
    }

    @DeleteMapping("/packages/{id}")
    @Operation(summary = "Deactivate a tour package")
    public ResponseEntity<ApiResponse<Void>> deletePackage(@PathVariable Long id) {
        packageService.deleteOrDeactivatePackage(id);
        return ResponseEntity.ok(ApiResponse.ok("Package deactivated"));
    }

    // ==========================================
    // VEHICLES
    // ==========================================

    @PostMapping("/vehicles")
    @Operation(summary = "Add a new vehicle")
    public ResponseEntity<ApiResponse<VehicleResponse>> createVehicle(
            @Valid @RequestBody VehicleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Vehicle created", vehicleService.createVehicle(request)));
    }

    @PutMapping("/vehicles/{id}")
    @Operation(summary = "Update an existing vehicle")
    public ResponseEntity<ApiResponse<VehicleResponse>> updateVehicle(
            @PathVariable Long id, @Valid @RequestBody VehicleRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Vehicle updated", vehicleService.updateVehicle(id, request)));
    }

    @DeleteMapping("/vehicles/{id}")
    @Operation(summary = "Delete a vehicle")
    public ResponseEntity<ApiResponse<Void>> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.ok(ApiResponse.ok("Vehicle deleted"));
    }

    // ==========================================
    // HOTELS
    // ==========================================

    @PostMapping("/hotels")
    @Operation(summary = "Add a new hotel")
    public ResponseEntity<ApiResponse<HotelResponse>> createHotel(
            @Valid @RequestBody HotelRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Hotel created", hotelService.createHotel(request)));
    }

    @PutMapping("/hotels/{id}")
    @Operation(summary = "Update an existing hotel")
    public ResponseEntity<ApiResponse<HotelResponse>> updateHotel(
            @PathVariable Long id, @Valid @RequestBody HotelRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Hotel updated", hotelService.updateHotel(id, request)));
    }

    @DeleteMapping("/hotels/{id}")
    @Operation(summary = "Deactivate a hotel")
    public ResponseEntity<ApiResponse<Void>> deleteHotel(@PathVariable Long id) {
        hotelService.deactivateHotel(id);
        return ResponseEntity.ok(ApiResponse.ok("Hotel deactivated"));
    }

    // ==========================================
    // TICKETS
    // ==========================================

    @PostMapping("/tickets")
    @Operation(summary = "Create a new ticket route")
    public ResponseEntity<ApiResponse<TicketResponse>> createTicket(
            @Valid @RequestBody TicketRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Ticket created", ticketService.createTicket(request)));
    }

    @PutMapping("/tickets/{id}")
    @Operation(summary = "Update an existing ticket")
    public ResponseEntity<ApiResponse<TicketResponse>> updateTicket(
            @PathVariable Long id, @Valid @RequestBody TicketRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Ticket updated", ticketService.updateTicket(id, request)));
    }

    @DeleteMapping("/tickets/{id}")
    @Operation(summary = "Delete a ticket")
    public ResponseEntity<ApiResponse<Void>> deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.ok(ApiResponse.ok("Ticket deleted"));
    }

    // ==========================================
    // ENQUIRIES
    // ==========================================

    @GetMapping("/enquiries")
    @Operation(summary = "View all user enquiries with optional status filter")
    public ResponseEntity<ApiResponse<Page<EnquiryResponse>>> getAllEnquiries(
            @RequestParam(required = false) EnquiryStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.ok("Enquiries fetched", enquiryService.getAllEnquiries(status, pageable)));
    }

    @PatchMapping("/enquiries/{id}/status")
    @Operation(summary = "Update the status and notes of an enquiry")
    public ResponseEntity<ApiResponse<EnquiryResponse>> updateEnquiryStatus(
            @PathVariable Long id, @Valid @RequestBody EnquiryStatusUpdate request) {
        return ResponseEntity.ok(ApiResponse.ok("Enquiry status updated", enquiryService.updateStatus(id, request)));
    }
}
