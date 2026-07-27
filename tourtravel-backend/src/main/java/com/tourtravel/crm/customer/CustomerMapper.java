package com.tourtravel.crm.customer;

import com.tourtravel.crm.customer.dto.CustomerDetailResponse;
import com.tourtravel.crm.customer.dto.CustomerListResponse;
import com.tourtravel.crm.customer.dto.CustomerRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

/**
 * MapStruct mapper for Customers. linkedUser/createdBy are resolved in the service
 * layer (they require a repository lookup by id), not here — same convention as
 * PackageMapper's handling of createdBy.
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CustomerMapper {

    @Mapping(target = "linkedUser", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "tenantId", ignore = true)
    Customer toEntity(CustomerRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "linkedUser", ignore = true)
    @Mapping(target = "tenantId", ignore = true)
    void updateEntityFromRequest(CustomerRequest request, @MappingTarget Customer entity);

    CustomerListResponse toListResponse(Customer entity);

    @Mapping(target = "linkedUserId", expression = "java(entity.getLinkedUser() != null ? entity.getLinkedUser().getId() : null)")
    @Mapping(target = "createdByName", expression = "java(entity.getCreatedBy() != null ? entity.getCreatedBy().getName() : null)")
    CustomerDetailResponse toDetailResponse(Customer entity);
}
