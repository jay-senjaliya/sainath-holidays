package com.tourtravel.sales.quotation;

import com.tourtravel.sales.quotation.Quotation.QuotationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Quotation repository. searchQuotations mirrors CustomerRepository/LeadRepository's
 * null-coalescing @Query convention, joined to Customer for name/phone search.
 */
@Repository
public interface QuotationRepository extends JpaRepository<Quotation, Long> {

    @Query("""
            SELECT q FROM Quotation q
            JOIN q.customer c
            WHERE (:active IS NULL OR q.active = :active)
              AND (:status IS NULL OR q.status = :status)
              AND (:customerId IS NULL OR c.id = :customerId)
              AND (:packageId IS NULL OR q.tourPackage.id = :packageId)
              AND (:search IS NULL OR
                   LOWER(q.quotationNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR
                   LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR
                   c.phone LIKE CONCAT('%', :search, '%'))
            """)
    Page<Quotation> searchQuotations(
            @Param("search") String search,
            @Param("status") QuotationStatus status,
            @Param("customerId") Long customerId,
            @Param("packageId") Long packageId,
            @Param("active") Boolean active,
            Pageable pageable
    );

    Optional<Quotation> findByShareTokenAndActiveTrue(String shareToken);
}
