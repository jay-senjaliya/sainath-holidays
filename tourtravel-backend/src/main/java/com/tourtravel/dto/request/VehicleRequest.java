package com.tourtravel.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

/**
 * Request DTO for Admins to add/edit Vehicles.
 */
@Data
public class VehicleRequest {

    @NotBlank(message = "Vehicle type is required (e.g., SUV, SEDAN)")
    private String vehicleType;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Price per day is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than zero")
    private BigDecimal pricePerDay;

    @NotNull(message = "Seating capacity is required")
    @Min(value = 1, message = "Minimum 1 seat required")
    private Integer seatingCapacity;

    private boolean available = true;

    private String imageUrl;
}
