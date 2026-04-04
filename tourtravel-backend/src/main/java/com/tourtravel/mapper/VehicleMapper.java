package com.tourtravel.mapper;

import com.tourtravel.dto.request.VehicleRequest;
import com.tourtravel.dto.response.VehicleResponse;
import com.tourtravel.entity.Vehicle;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface VehicleMapper {

    Vehicle toEntity(VehicleRequest request);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromRequest(VehicleRequest request, @MappingTarget Vehicle entity);

    VehicleResponse toResponse(Vehicle entity);
}
