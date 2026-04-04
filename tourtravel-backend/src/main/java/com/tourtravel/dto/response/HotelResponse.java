package com.tourtravel.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * Response DTO for Hotels.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HotelResponse {

    private Long id;
    private String name;
    private String location;
    private Double latitude;
    private Double longitude;
    private BigDecimal pricePerNight;
    private String description;
    private Integer starRating;
    private boolean active;
    private String imageUrl;

    private List<AmenityResponse> amenities;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AmenityResponse {
        private Long id;
        private String amenity;
    }
}
