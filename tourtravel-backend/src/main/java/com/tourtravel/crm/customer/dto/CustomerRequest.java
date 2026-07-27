package com.tourtravel.crm.customer.dto;

import com.tourtravel.crm.customer.Customer.CustomerSource;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Request DTO for creating/updating a Customer. Sent by Admin.
 */
@Data
public class CustomerRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must be at most 100 characters")
    private String name;

    @Email(message = "Email must be a valid email address")
    @Size(max = 150, message = "Email must be at most 150 characters")
    private String email;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[+]?[0-9]{7,15}$", message = "Phone must be 7-15 digits, optionally prefixed with +")
    private String phone;

    @Pattern(regexp = "^[+]?[0-9]{7,15}$", message = "Alternate phone must be 7-15 digits, optionally prefixed with +")
    private String alternatePhone;

    @Size(max = 100, message = "City must be at most 100 characters")
    private String city;

    @Size(max = 100, message = "State must be at most 100 characters")
    private String state;

    @Size(max = 100, message = "Country must be at most 100 characters")
    private String country;

    @NotNull(message = "Source is required")
    private CustomerSource source;

    /** Optional — link to an existing website account belonging to this customer. */
    private Long linkedUserId;

    private boolean active = true;
}
