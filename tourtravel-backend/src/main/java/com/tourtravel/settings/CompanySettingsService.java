package com.tourtravel.settings;

import com.tourtravel.settings.dto.CompanySettingsRequest;
import com.tourtravel.settings.dto.CompanySettingsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

/**
 * Singleton settings — get-or-create-default rather than a normal CRUD
 * resource. Also the lookup point QuotationService uses for the effective
 * Terms & Conditions and the approval discount threshold.
 */
@Service
@RequiredArgsConstructor
public class CompanySettingsService {

    private final CompanySettingsRepository companySettingsRepository;

    @Transactional
    public CompanySettings getOrCreateSettings() {
        return companySettingsRepository.findAll().stream()
                .findFirst()
                .orElseGet(() -> companySettingsRepository.save(
                        CompanySettings.builder()
                                .companyName("Sainath Holidays")
                                .build()));
    }

    @Transactional(readOnly = true)
    public CompanySettingsResponse getSettings() {
        return toResponse(getOrCreateSettings());
    }

    @Transactional
    public CompanySettingsResponse updateSettings(CompanySettingsRequest request) {
        CompanySettings settings = getOrCreateSettings();
        settings.setCompanyName(request.getCompanyName());
        settings.setLogoUrl(request.getLogoUrl());
        settings.setAddress(request.getAddress());
        settings.setPhone(request.getPhone());
        settings.setEmail(request.getEmail());
        settings.setGstNumber(request.getGstNumber());
        settings.setWebsite(request.getWebsite());
        settings.setDefaultTermsAndConditions(request.getDefaultTermsAndConditions());
        settings.setApprovalDiscountThreshold(request.getApprovalDiscountThreshold());
        return toResponse(companySettingsRepository.save(settings));
    }

    @Transactional(readOnly = true)
    public BigDecimal getApprovalDiscountThreshold() {
        return getOrCreateSettings().getApprovalDiscountThreshold();
    }

    private CompanySettingsResponse toResponse(CompanySettings settings) {
        return CompanySettingsResponse.builder()
                .id(settings.getId())
                .companyName(settings.getCompanyName())
                .logoUrl(settings.getLogoUrl())
                .address(settings.getAddress())
                .phone(settings.getPhone())
                .email(settings.getEmail())
                .gstNumber(settings.getGstNumber())
                .website(settings.getWebsite())
                .defaultTermsAndConditions(settings.getDefaultTermsAndConditions())
                .approvalDiscountThreshold(settings.getApprovalDiscountThreshold())
                .updatedAt(settings.getUpdatedAt())
                .build();
    }
}
