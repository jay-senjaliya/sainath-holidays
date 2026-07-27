package com.tourtravel.crm.customer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Customer repository. searchCustomers mirrors PackageRepository.searchPackages'
 * null-coalescing @Query convention so every filter is optional and combinable.
 */
@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    @Query("""
            SELECT c FROM Customer c
            WHERE (:active IS NULL OR c.active = :active)
              AND (:source IS NULL OR c.source = :source)
              AND (:city IS NULL OR LOWER(c.city) LIKE LOWER(CONCAT('%', :city, '%')))
              AND (:search IS NULL OR
                   LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR
                   LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%')) OR
                   c.phone LIKE CONCAT('%', :search, '%'))
            """)
    Page<Customer> searchCustomers(
            @Param("search") String search,
            @Param("source") Customer.CustomerSource source,
            @Param("city") String city,
            @Param("active") Boolean active,
            Pageable pageable
    );
}
