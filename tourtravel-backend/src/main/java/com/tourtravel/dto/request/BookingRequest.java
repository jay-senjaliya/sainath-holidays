package com.tourtravel.dto.request;

import com.tourtravel.entity.BookingStatus;
import com.tourtravel.entity.PaymentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BookingRequest {
    private Long userId;
    private Long packageId;
    private Long vehicleId;
    private Long hotelId;

    @NotBlank(message = "Customer name is required")
    private String customerName;

    private String customerEmail;

    @NotBlank(message = "Customer phone is required")
    private String customerPhone;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @NotNull(message = "Total amount is required")
    private BigDecimal totalAmount;

    private BigDecimal advancePaid;
    
    private BookingStatus bookingStatus;
    private PaymentStatus paymentStatus;
    private String notes;
}
