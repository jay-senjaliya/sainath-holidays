package com.tourtravel.mapper;

import com.tourtravel.dto.request.EnquiryRequest;
import com.tourtravel.dto.response.EnquiryResponse;
import com.tourtravel.entity.Enquiry;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EnquiryMapper {

    // Converts incoming user request to core entity (Status is PENDING by default)
    @Mapping(target = "status", constant = "PENDING")
    Enquiry toEntity(EnquiryRequest request);

    // Maps back to user response, embedding User summary and package title (if linked)
    @Mapping(source = "user", target = "user")
    @Mapping(source = "tourPackage.id", target = "packageId")
    @Mapping(source = "tourPackage.title", target = "packageTitle")
    EnquiryResponse toResponse(Enquiry entity);
}
