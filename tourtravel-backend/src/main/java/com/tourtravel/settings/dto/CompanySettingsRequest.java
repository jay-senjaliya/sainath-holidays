package com.tourtravel.settings.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CompanySettingsRequest {

    @NotBlank(message = "Company name is required")
    @Size(max = 200)
    private String companyName;

    @Size(max = 500)
    private String logoUrl;

    private String address;

    @Size(max = 20)
    private String phone;

    @Size(max = 150)
    private String email;

    @Size(max = 30)
    private String gstNumber;

    @Size(max = 200)
    private String website;

    private String defaultTermsAndConditions;

    @DecimalMin(value = "0.0", message = "Threshold cannot be negative")
    private BigDecimal approvalDiscountThreshold;
}
