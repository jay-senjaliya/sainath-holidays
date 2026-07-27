package com.tourtravel.crm.customer.dto;

import com.tourtravel.crm.customer.Customer.CustomerSource;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Full detail response DTO for a specific customer.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDetailResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String alternatePhone;
    private String city;
    private String state;
    private String country;
    private CustomerSource source;
    private boolean active;
    private Long linkedUserId;
    private String createdByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
