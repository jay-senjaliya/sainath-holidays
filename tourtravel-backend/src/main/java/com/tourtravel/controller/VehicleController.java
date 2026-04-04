package com.tourtravel.controller;

import com.tourtravel.dto.response.ApiResponse;
import com.tourtravel.dto.response.VehicleResponse;
import com.tourtravel.service.VehicleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/vehicles")
@RequiredArgsConstructor
@Tag(name = "Public - Vehicles", description = "Public endpoints for vehicle browsing")
public class VehicleController {

    private final VehicleService vehicleService;

    @GetMapping
    @Operation(summary = "Get list of vehicles")
    public ResponseEntity<ApiResponse<Page<VehicleResponse>>> getAllVehicles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "true") boolean availableOnly) {

        Pageable pageable = PageRequest.of(page, size);
        Page<VehicleResponse> response = vehicleService.getAllVehicles(pageable, availableOnly);
        return ResponseEntity.ok(ApiResponse.ok("Vehicles fetched successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get vehicle details by ID")
    public ResponseEntity<ApiResponse<VehicleResponse>> getVehicleById(@PathVariable Long id) {
        
        VehicleResponse response = vehicleService.getVehicleById(id);
        return ResponseEntity.ok(ApiResponse.ok("Vehicle details fetched successfully", response));
    }
}
