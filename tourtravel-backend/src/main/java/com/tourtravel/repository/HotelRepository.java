package com.tourtravel.repository;

import com.tourtravel.entity.Hotel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {

    Page<Hotel> findByActiveTrue(Pageable pageable);

    Optional<Hotel> findByIdAndActiveTrue(Long id);

    @Query("""
            SELECT h FROM Hotel h
            WHERE h.active = true
              AND (:location IS NULL OR LOWER(h.location) LIKE LOWER(CONCAT('%', :location, '%')))
              AND (:maxPrice IS NULL OR h.pricePerNight <= :maxPrice)
              AND (:stars IS NULL OR h.starRating = :stars)
            """)
    Page<Hotel> searchHotels(
            @Param("location") String location,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("stars") Integer stars,
            Pageable pageable
    );
}
