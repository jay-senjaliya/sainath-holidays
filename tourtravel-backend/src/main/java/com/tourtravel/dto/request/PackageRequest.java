package com.tourtravel.dto.request;

import com.tourtravel.entity.TourPackage.PackageCategory;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/**
 * Request DTO for creating/updating a Tour Package.
 * Sent by Admin.
 */
@Data
public class PackageRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than zero")
    private BigDecimal price;

    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 day")
    private Integer durationDays;

    @NotNull(message = "Latitude is required for map features")
    private Double latitude;

    @NotNull(message = "Longitude is required for map features")
    private Double longitude;

    @NotBlank(message = "Location string is required")
    private String location;

    @NotNull(message = "Category is required")
    private PackageCategory category;

    private boolean active = true;

    @Valid
    @NotEmpty(message = "At least one itinerary day is required")
    private List<ItineraryRequest> itineraries;

    @Valid
    @NotEmpty(message = "At least one package image is required")
    private List<ImageRequest> images;

    @Data
    public static class ItineraryRequest {
        @NotNull(message = "Day number is required")
        private Integer dayNumber;

        @NotBlank(message = "Itinerary title is required")
        private String title;

        @NotBlank(message = "Itinerary description is required")
        private String description;
    }

    @Data
    public static class ImageRequest {
        @NotBlank(message = "Image URL is required")
        private String imageUrl;

        private boolean primary = false;
    }
}
