package com.tourtravel.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Response DTO for Vehicles.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleResponse {

    private Long id;
    private String vehicleType;
    private String description;
    private BigDecimal pricePerDay;
    private Integer seatingCapacity;
    private boolean available;
    private String imageUrl;
}
