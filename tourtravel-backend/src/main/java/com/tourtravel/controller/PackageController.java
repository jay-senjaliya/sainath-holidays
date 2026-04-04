package com.tourtravel.controller;

import com.tourtravel.dto.response.ApiResponse;
import com.tourtravel.dto.response.PackageDetailResponse;
import com.tourtravel.dto.response.PackageListResponse;
import com.tourtravel.entity.TourPackage.PackageCategory;
import com.tourtravel.service.PackageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Public endpoints for browsing Tour Packages.
 * Configured as unauthenticated in SecurityConfig.
 */
@RestController
@RequestMapping("/api/v1/packages")
@RequiredArgsConstructor
@Tag(name = "Public - Packages", description = "Public package browsing, filtering, and map data")
public class PackageController {

    private final PackageService packageService;

    @GetMapping
    @Operation(summary = "Get all active tour packages with optional category filter and pagination")
    public ResponseEntity<ApiResponse<Page<PackageListResponse>>> getAllPackages(
            @RequestParam(required = false) PackageCategory category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<PackageListResponse> packages = packageService.getAllPackages(category, pageable);
        return ResponseEntity.ok(ApiResponse.ok("Packages fetched successfully", packages));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get full details of a specific active package (includes itineraries and images)")
    public ResponseEntity<ApiResponse<PackageDetailResponse>> getPackageById(
            @PathVariable Long id) {
        
        PackageDetailResponse response = packageService.getPackageById(id);
        return ResponseEntity.ok(ApiResponse.ok("Package fetched successfully", response));
    }

    @GetMapping("/map")
    @Operation(summary = "Get lean representations of all active packages for Map markers")
    public ResponseEntity<ApiResponse<List<PackageListResponse>>> getPackagesForMap() {
        
        List<PackageListResponse> packages = packageService.getPackagesForMap();
        return ResponseEntity.ok(ApiResponse.ok("Map packages fetched successfully", packages));
    }
}
