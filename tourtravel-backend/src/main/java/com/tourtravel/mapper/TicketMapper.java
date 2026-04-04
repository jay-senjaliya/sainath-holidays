package com.tourtravel.mapper;

import com.tourtravel.dto.request.TicketRequest;
import com.tourtravel.dto.response.TicketResponse;
import com.tourtravel.entity.Ticket;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TicketMapper {

    Ticket toEntity(TicketRequest request);

    TicketResponse toResponse(Ticket entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateEntityFromRequest(TicketRequest request, @MappingTarget Ticket entity);
}
