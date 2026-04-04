package com.tourtravel.repository;

import com.tourtravel.entity.Booking;
import com.tourtravel.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByBookingStatusOrderByStartDateAsc(BookingStatus status);

    @Query("SELECT b FROM Booking b WHERE b.startDate BETWEEN :start AND :end ORDER BY b.startDate ASC")
    List<Booking> findUpcomingBookings(LocalDate start, LocalDate end);

    @Query("SELECT b FROM Booking b WHERE b.paymentStatus != 'FULL' AND b.bookingStatus = 'CONFIRMED' ORDER BY b.startDate ASC")
    List<Booking> findPendingPayments();

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.bookingStatus = 'CONFIRMED'")
    long countConfirmedBookings();
}
