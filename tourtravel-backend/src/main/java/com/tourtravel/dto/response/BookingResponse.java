package com.tourtravel.dto.response;

import com.tourtravel.entity.BookingStatus;
import com.tourtravel.entity.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class BookingResponse {
    private Long id;
    private Long userId;
    private String userName;
    private Long packageId;
    private String packageTitle;
    private Long vehicleId;
    private String vehicleName;
    private Long hotelId;
    private String hotelName;

    private String customerName;
    private String customerEmail;
    private String customerPhone;

    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalAmount;
    private BigDecimal advancePaid;
    private BigDecimal balanceAmount;
    
    private BookingStatus bookingStatus;
    private PaymentStatus paymentStatus;
    private String notes;
    private LocalDateTime createdAt;
}
