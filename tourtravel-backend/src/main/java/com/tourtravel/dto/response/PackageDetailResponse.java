package com.tourtravel.dto.response;

import com.tourtravel.entity.TourPackage.PackageCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * Full detail response DTO for a specific package.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PackageDetailResponse {

    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private Integer durationDays;
    private Double latitude;
    private Double longitude;
    private String location;
    private PackageCategory category;
    private boolean active;

    private List<ItineraryResponse> itineraries;
    private List<ImageResponse> images;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItineraryResponse {
        private Long id;
        private Integer dayNumber;
        private String title;
        private String description;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImageResponse {
        private Long id;
        private String imageUrl;
        private boolean primary;
    }
}
