package com.tourtravel.repository;

import com.tourtravel.entity.Enquiry;
import com.tourtravel.entity.Enquiry.EnquiryStatus;
import com.tourtravel.entity.Enquiry.ServiceType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {

    Page<Enquiry> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    Page<Enquiry> findByStatusOrderByCreatedAtDesc(EnquiryStatus status, Pageable pageable);

    Page<Enquiry> findAllByOrderByCreatedAtDesc(Pageable pageable);

    long countByStatus(EnquiryStatus status);

    @Query("SELECT COUNT(e) FROM Enquiry e WHERE e.status = :status")
    long countPending(@Param("status") EnquiryStatus status);
}
