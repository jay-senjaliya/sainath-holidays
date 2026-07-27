package com.tourtravel.settings.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanySettingsResponse {

    private Long id;
    private String companyName;
    private String logoUrl;
    private String address;
    private String phone;
    private String email;
    private String gstNumber;
    private String website;
    private String defaultTermsAndConditions;
    private BigDecimal approvalDiscountThreshold;
    private LocalDateTime updatedAt;
}
