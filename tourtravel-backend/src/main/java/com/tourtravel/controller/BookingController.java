package com.tourtravel.controller;

import com.tourtravel.dto.request.BookingRequest;
import com.tourtravel.dto.response.ApiResponse;
import com.tourtravel.dto.response.BookingResponse;
import com.tourtravel.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/bookings")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(@Valid @RequestBody BookingRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Booking created successfully", bookingService.createBooking(request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Bookings fetched successfully", bookingService.getAllBookings()));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getUpcomingBookings(@RequestParam(defaultValue = "14") int days) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Upcoming bookings fetched successfully", bookingService.getUpcomingBookings(days)));
    }

    @GetMapping("/pending-payments")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getPendingPayments() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Pending payments fetched successfully", bookingService.getPendingPayments()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> updateBooking(@PathVariable Long id, @Valid @RequestBody BookingRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Booking updated successfully", bookingService.updateBooking(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Booking deleted successfully", null));
    }
}
