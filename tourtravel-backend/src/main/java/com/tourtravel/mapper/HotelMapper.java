package com.tourtravel.mapper;

import com.tourtravel.dto.request.HotelRequest;
import com.tourtravel.dto.response.HotelResponse;
import com.tourtravel.entity.Hotel;
import com.tourtravel.entity.HotelAmenity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface HotelMapper {

    Hotel toEntity(HotelRequest request);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromRequest(HotelRequest request, @MappingTarget Hotel entity);

    HotelResponse toResponse(Hotel entity);

    HotelAmenity toAmenityEntity(HotelRequest.AmenityRequest request);
    HotelResponse.AmenityResponse toAmenityResponse(HotelAmenity entity);
}
