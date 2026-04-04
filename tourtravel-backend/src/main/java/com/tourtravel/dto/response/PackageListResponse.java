package com.tourtravel.dto.response;

import com.tourtravel.entity.TourPackage.PackageCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Lean response DTO for listing packages (public).
 * Excludes full description, itineraries, and secondary images.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PackageListResponse {

    private Long id;
    private String title;
    private BigDecimal price;
    private Integer durationDays;
    private String location;
    private Double latitude;
    private Double longitude;
    private PackageCategory category;
    
    // Only the primary image URL
    private String primaryImageUrl;
}
