package com.tourtravel.crm.lead;

import com.tourtravel.crm.customer.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Lead repository. searchLeads mirrors CustomerRepository/PackageRepository's
 * null-coalescing @Query convention; it joins Customer since search matches on
 * the customer's name/phone as well as the lead's own requirement text.
 */
@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {

    @Query("""
            SELECT l FROM Lead l
            JOIN l.customer c
            WHERE (:active IS NULL OR l.active = :active)
              AND (:status IS NULL OR l.status = :status)
              AND (:source IS NULL OR l.source = :source)
              AND (:customerId IS NULL OR c.id = :customerId)
              AND (:assignedToId IS NULL OR l.assignedTo.id = :assignedToId)
              AND (:search IS NULL OR
                   LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR
                   c.phone LIKE CONCAT('%', :search, '%') OR
                   LOWER(l.requirement) LIKE LOWER(CONCAT('%', :search, '%')))
            """)
    Page<Lead> searchLeads(
            @Param("search") String search,
            @Param("status") Lead.LeadStatus status,
            @Param("source") Customer.CustomerSource source,
            @Param("customerId") Long customerId,
            @Param("assignedToId") Long assignedToId,
            @Param("active") Boolean active,
            Pageable pageable
    );

    List<Lead> findByActiveTrueOrderByCreatedAtDesc();
}
