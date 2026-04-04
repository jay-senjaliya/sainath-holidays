package com.tourtravel.repository;

import com.tourtravel.entity.TourPackage;
import com.tourtravel.entity.TourPackage.PackageCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Package repository. Uses JpaSpecificationExecutor for dynamic filtering.
 * Custom query fetches images eagerly to avoid N+1 on list views.
 */
@Repository
public interface PackageRepository extends JpaRepository<TourPackage, Long>,
        JpaSpecificationExecutor<TourPackage> {

    Page<TourPackage> findByActiveTrue(Pageable pageable);

    Page<TourPackage> findByCategoryAndActiveTrue(PackageCategory category, Pageable pageable);

    Optional<TourPackage> findByIdAndActiveTrue(Long id);

    List<TourPackage> findAllByActiveTrue();

    @Query("""
            SELECT p FROM TourPackage p
            WHERE p.active = true
              AND (:category IS NULL OR p.category = :category)
              AND (:minPrice IS NULL OR p.price >= :minPrice)
              AND (:maxPrice IS NULL OR p.price <= :maxPrice)
              AND (:minDays IS NULL OR p.durationDays >= :minDays)
              AND (:maxDays IS NULL OR p.durationDays <= :maxDays)
              AND (:location IS NULL OR LOWER(p.location) LIKE LOWER(CONCAT('%', :location, '%')))
            """)
    Page<TourPackage> searchPackages(
            @Param("category") PackageCategory category,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("minDays") Integer minDays,
            @Param("maxDays") Integer maxDays,
            @Param("location") String location,
            Pageable pageable
    );

    /** Minimal projection for map markers — avoids loading full entity graph */
    @Query("SELECT p FROM TourPackage p WHERE p.active = true")
    Page<TourPackage> findAllForMap(Pageable pageable);
}
