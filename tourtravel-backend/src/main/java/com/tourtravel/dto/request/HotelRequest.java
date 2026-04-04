package com.tourtravel.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/**
 * Request DTO for Admins to add/edit Hotels.
 */
@Data
public class HotelRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    @NotNull(message = "Price per night is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be > 0")
    private BigDecimal pricePerNight;

    private String description;

    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    private Integer starRating;

    private boolean active = true;

    private String imageUrl;

    @Valid
    private List<AmenityRequest> amenities;

    @Data
    public static class AmenityRequest {
        @NotBlank(message = "Amenity name is required")
        private String amenity;
    }
}
