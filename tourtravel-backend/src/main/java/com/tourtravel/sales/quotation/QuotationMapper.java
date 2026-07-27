package com.tourtravel.sales.quotation;

import com.tourtravel.sales.quotation.dto.QuotationDetailResponse;
import com.tourtravel.sales.quotation.dto.QuotationListResponse;
import com.tourtravel.sales.quotation.dto.QuotationRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

/**
 * MapStruct mapper for Quotations. customer/tourPackage/createdBy are resolved
 * in the service layer (repository lookups by id) — same convention as
 * CustomerMapper/LeadMapper. status/quotationNumber are never touched here.
 *
 * Phase 2: items are also resolved/priced in the service layer (each line needs
 * a catalog lookup or free-text handling depending on itemType, plus subtotal
 * computation) — ignored here on the request side, same reasoning. On the
 * response side, QuotationItem's fields line up 1:1 with QuotationItemResponse,
 * so MapStruct maps the list with no per-field configuration needed.
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface QuotationMapper {

    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "tourPackage", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "quotationNumber", ignore = true)
    @Mapping(target = "items", ignore = true)
    Quotation toEntity(QuotationRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "tourPackage", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "quotationNumber", ignore = true)
    @Mapping(target = "items", ignore = true)
    void updateEntityFromRequest(QuotationRequest request, @MappingTarget Quotation entity);

    @Mapping(target = "customerId", expression = "java(entity.getCustomer().getId())")
    @Mapping(target = "customerName", expression = "java(entity.getCustomer().getName())")
    @Mapping(target = "customerPhone", expression = "java(entity.getCustomer().getPhone())")
    @Mapping(target = "packageId", expression = "java(entity.getTourPackage() != null ? entity.getTourPackage().getId() : null)")
    @Mapping(target = "packageTitle", expression = "java(entity.getTourPackage() != null ? entity.getTourPackage().getTitle() : null)")
    @Mapping(target = "itemCount", expression = "java(entity.getItems() != null ? entity.getItems().size() : 0)")
    QuotationListResponse toListResponse(Quotation entity);

    @Mapping(target = "customerId", expression = "java(entity.getCustomer().getId())")
    @Mapping(target = "customerName", expression = "java(entity.getCustomer().getName())")
    @Mapping(target = "customerPhone", expression = "java(entity.getCustomer().getPhone())")
    @Mapping(target = "customerEmail", expression = "java(entity.getCustomer().getEmail())")
    @Mapping(target = "packageId", expression = "java(entity.getTourPackage() != null ? entity.getTourPackage().getId() : null)")
    @Mapping(target = "packageTitle", expression = "java(entity.getTourPackage() != null ? entity.getTourPackage().getTitle() : null)")
    @Mapping(target = "createdByName", expression = "java(entity.getCreatedBy() != null ? entity.getCreatedBy().getName() : null)")
    @Mapping(target = "computedPricing", expression = "java(entity.getItems() != null && !entity.getItems().isEmpty())")
    @Mapping(target = "approvedByName", expression = "java(entity.getApprovedBy() != null ? entity.getApprovedBy().getName() : null)")
    QuotationDetailResponse toDetailResponse(Quotation entity);

    QuotationDetailResponse.QuotationItemResponse toItemResponse(QuotationItem item);
}
