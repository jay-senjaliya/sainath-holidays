package com.tourtravel.controller;

import com.tourtravel.dto.response.ApiResponse;
import com.tourtravel.dto.response.HotelResponse;
import com.tourtravel.service.HotelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/hotels")
@RequiredArgsConstructor
@Tag(name = "Public - Hotels", description = "Public endpoints for hotel browsing")
public class HotelController {

    private final HotelService hotelService;

    @GetMapping
    @Operation(summary = "Get list of active hotels")
    public ResponseEntity<ApiResponse<Page<HotelResponse>>> getAllHotels(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<HotelResponse> response = hotelService.getAllActiveHotels(pageable);
        return ResponseEntity.ok(ApiResponse.ok("Hotels fetched successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get hotel details by ID")
    public ResponseEntity<ApiResponse<HotelResponse>> getHotelById(@PathVariable Long id) {
        
        HotelResponse response = hotelService.getHotelById(id);
        return ResponseEntity.ok(ApiResponse.ok("Hotel details fetched successfully", response));
    }
}
