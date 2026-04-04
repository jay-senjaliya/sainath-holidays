package com.tourtravel.service;

import com.tourtravel.dto.request.BookingRequest;
import com.tourtravel.dto.response.BookingResponse;
import com.tourtravel.entity.*;
import com.tourtravel.exception.ResourceNotFoundException;
import com.tourtravel.mapper.BookingMapper;
import com.tourtravel.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final PackageRepository packageRepository;
    private final VehicleRepository vehicleRepository;
    private final HotelRepository hotelRepository;
    private final BookingMapper bookingMapper;

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        Booking booking = bookingMapper.toEntity(request);

        // Link relations
        if (request.getUserId() != null) {
            booking.setUser(userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getUserId())));
        }
        if (request.getPackageId() != null) {
            booking.setTourPackage(packageRepository.findById(request.getPackageId())
                    .orElseThrow(() -> new ResourceNotFoundException("TourPackage", "id", request.getPackageId())));
        }
        if (request.getVehicleId() != null) {
            booking.setVehicle(vehicleRepository.findById(request.getVehicleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", request.getVehicleId())));
        }
        if (request.getHotelId() != null) {
            booking.setHotel(hotelRepository.findById(request.getHotelId())
                    .orElseThrow(() -> new ResourceNotFoundException("Hotel", "id", request.getHotelId())));
        }

        // Business Logic: Calc Payment Status if not provided
        if (booking.getPaymentStatus() == null) {
            updatePaymentStatus(booking);
        }
        if (booking.getBookingStatus() == null) {
            booking.setBookingStatus(BookingStatus.CONFIRMED);
        }

        Booking saved = bookingRepository.save(booking);
        log.info("Booking created successfully ID: {}", saved.getId());
        return bookingMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(bookingMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getUpcomingBookings(int days) {
        LocalDate end = LocalDate.now().plusDays(days);
        return bookingRepository.findUpcomingBookings(LocalDate.now(), end).stream()
                .map(bookingMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getPendingPayments() {
        return bookingRepository.findPendingPayments().stream()
                .map(bookingMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponse updateBooking(Long id, BookingRequest request) {
        Booking existing = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));
        
        // Update fields
        existing.setCustomerName(request.getCustomerName());
        existing.setCustomerPhone(request.getCustomerPhone());
        existing.setCustomerEmail(request.getCustomerEmail());
        existing.setStartDate(request.getStartDate());
        existing.setEndDate(request.getEndDate());
        existing.setTotalAmount(request.getTotalAmount());
        existing.setAdvancePaid(request.getAdvancePaid());
        existing.setNotes(request.getNotes());
        
        if (request.getBookingStatus() != null) existing.setBookingStatus(request.getBookingStatus());
        if (request.getPaymentStatus() != null) {
            existing.setPaymentStatus(request.getPaymentStatus());
        } else {
            updatePaymentStatus(existing);
        }

        Booking updated = bookingRepository.save(existing);
        return bookingMapper.toResponse(updated);
    }

    @Transactional
    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }

    private void updatePaymentStatus(Booking booking) {
        BigDecimal total = booking.getTotalAmount();
        BigDecimal paid = booking.getAdvancePaid() != null ? booking.getAdvancePaid() : BigDecimal.ZERO;
        
        if (paid.compareTo(BigDecimal.ZERO) == 0) {
            booking.setPaymentStatus(PaymentStatus.PENDING);
        } else if (paid.compareTo(total) >= 0) {
            booking.setPaymentStatus(PaymentStatus.FULL);
        } else {
            booking.setPaymentStatus(PaymentStatus.PARTIAL);
        }
    }
}
