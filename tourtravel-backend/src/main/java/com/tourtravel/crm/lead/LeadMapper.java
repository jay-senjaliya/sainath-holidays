package com.tourtravel.crm.lead;

import com.tourtravel.crm.lead.dto.LeadDetailResponse;
import com.tourtravel.crm.lead.dto.LeadListResponse;
import com.tourtravel.crm.lead.dto.LeadRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

/**
 * MapStruct mapper for Leads. customer/assignedTo/createdBy are resolved in the
 * service layer (repository lookups by id) — same convention as CustomerMapper.
 * status is never touched here; see LeadRequest for why.
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface LeadMapper {

    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "assignedTo", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "status", ignore = true)
    Lead toEntity(LeadRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "assignedTo", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "status", ignore = true)
    void updateEntityFromRequest(LeadRequest request, @MappingTarget Lead entity);

    @Mapping(target = "customerId", expression = "java(entity.getCustomer().getId())")
    @Mapping(target = "customerName", expression = "java(entity.getCustomer().getName())")
    @Mapping(target = "customerPhone", expression = "java(entity.getCustomer().getPhone())")
    @Mapping(target = "assignedToId", expression = "java(entity.getAssignedTo() != null ? entity.getAssignedTo().getId() : null)")
    @Mapping(target = "assignedToName", expression = "java(entity.getAssignedTo() != null ? entity.getAssignedTo().getName() : null)")
    LeadListResponse toListResponse(Lead entity);

    @Mapping(target = "customerId", expression = "java(entity.getCustomer().getId())")
    @Mapping(target = "customerName", expression = "java(entity.getCustomer().getName())")
    @Mapping(target = "customerPhone", expression = "java(entity.getCustomer().getPhone())")
    @Mapping(target = "customerEmail", expression = "java(entity.getCustomer().getEmail())")
    @Mapping(target = "assignedToId", expression = "java(entity.getAssignedTo() != null ? entity.getAssignedTo().getId() : null)")
    @Mapping(target = "assignedToName", expression = "java(entity.getAssignedTo() != null ? entity.getAssignedTo().getName() : null)")
    @Mapping(target = "createdByName", expression = "java(entity.getCreatedBy() != null ? entity.getCreatedBy().getName() : null)")
    LeadDetailResponse toDetailResponse(Lead entity);
}
