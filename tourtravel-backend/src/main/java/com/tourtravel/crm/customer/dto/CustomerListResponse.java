package com.tourtravel.crm.customer.dto;

import com.tourtravel.crm.customer.Customer.CustomerSource;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Lean response DTO for the Customer list/search table.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerListResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String city;
    private CustomerSource source;
    private boolean active;
    private LocalDateTime createdAt;
}
