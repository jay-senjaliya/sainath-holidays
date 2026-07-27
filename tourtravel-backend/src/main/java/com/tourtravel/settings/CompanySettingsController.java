package com.tourtravel.settings;

import com.tourtravel.dto.response.ApiResponse;
import com.tourtravel.settings.dto.CompanySettingsRequest;
import com.tourtravel.settings.dto.CompanySettingsResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Admin-only agency branding settings — a singleton resource (GET/PUT only,
 * no create/delete/list). Falls under SecurityConfig's existing
 * "/api/v1/admin/**" -> hasRole("ADMIN") rule.
 */
@RestController
@RequestMapping("/api/v1/admin/settings/company")
@RequiredArgsConstructor
@Tag(name = "Admin - Company Settings", description = "Agency branding used on the Quotation PDF")
@SecurityRequirement(name = "bearerAuth")
public class CompanySettingsController {

    private final CompanySettingsService companySettingsService;

    @GetMapping
    @Operation(summary = "Get the current company settings (created with defaults on first access)")
    public ResponseEntity<ApiResponse<CompanySettingsResponse>> getSettings() {
        return ResponseEntity.ok(ApiResponse.ok("Company settings fetched successfully", companySettingsService.getSettings()));
    }

    @PutMapping
    @Operation(summary = "Update the company settings")
    public ResponseEntity<ApiResponse<CompanySettingsResponse>> updateSettings(@Valid @RequestBody CompanySettingsRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Company settings updated", companySettingsService.updateSettings(request)));
    }
}
