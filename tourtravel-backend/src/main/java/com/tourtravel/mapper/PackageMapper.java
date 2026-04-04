package com.tourtravel.mapper;

import com.tourtravel.dto.request.PackageRequest;
import com.tourtravel.dto.response.PackageDetailResponse;
import com.tourtravel.dto.response.PackageListResponse;
import com.tourtravel.entity.PackageImage;
import com.tourtravel.entity.PackageItinerary;
import com.tourtravel.entity.TourPackage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

/**
 * MapStruct mapper for Tour Packages.
 * Configured as a Spring component. Ignores unmapped target properties.
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PackageMapper {

    // ---- Entity ↔ DTO ----

    TourPackage toEntity(PackageRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    void updateEntityFromRequest(PackageRequest request, @MappingTarget TourPackage entity);

    PackageDetailResponse toDetailResponse(TourPackage entity);

    // List response logic: extract the primary image URL
    @Mapping(target = "primaryImageUrl", expression = "java(getPrimaryImageUrl(entity))")
    PackageListResponse toListResponse(TourPackage entity);

    // ---- Nested mappings ----

    PackageItinerary toItineraryEntity(PackageRequest.ItineraryRequest request);
    PackageImage toImageEntity(PackageRequest.ImageRequest request);

    PackageDetailResponse.ItineraryResponse toItineraryResponse(PackageItinerary entity);
    PackageDetailResponse.ImageResponse toImageResponse(PackageImage entity);

    // ---- Custom mapping helpers ----

    default String getPrimaryImageUrl(TourPackage entity) {
        if (entity.getImages() == null || entity.getImages().isEmpty()) {
            return null;
        }
        return entity.getImages().stream()
                .filter(PackageImage::isPrimary)
                .map(PackageImage::getImageUrl)
                .findFirst()
                .orElse(entity.getImages().get(0).getImageUrl());
    }
}
