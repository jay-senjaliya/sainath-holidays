package com.tourtravel.sales.quotation;

import com.tourtravel.dto.response.ApiResponse;
import com.tourtravel.sales.quotation.Quotation.QuotationStatus;
import com.tourtravel.sales.quotation.dto.ApprovalUpdateRequest;
import com.tourtravel.sales.quotation.dto.QuotationDetailResponse;
import com.tourtravel.sales.quotation.dto.QuotationListResponse;
import com.tourtravel.sales.quotation.dto.QuotationRequest;
import com.tourtravel.sales.quotation.dto.QuotationStatusUpdateRequest;
import com.tourtravel.sales.quotation.dto.WhatsAppLinkResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * Admin-only Sales Quotation endpoints. Dedicated controller, same rationale as
 * CustomerController/LeadController — keeps this module out of the shared
 * AdminController. Falls under SecurityConfig's existing
 * "/api/v1/admin/**" -> hasRole("ADMIN") rule.
 */
@RestController
@RequestMapping("/api/v1/admin/quotations")
@RequiredArgsConstructor
@Tag(name = "Admin - Quotations", description = "Sales quotation management: search, CRUD, and status")
@SecurityRequirement(name = "bearerAuth")
public class QuotationController {

    private final QuotationService quotationService;

    @GetMapping
    @Operation(summary = "Search/list quotations with optional filters, sorting, and pagination")
    public ResponseEntity<ApiResponse<Page<QuotationListResponse>>> getAllQuotations(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) QuotationStatus status,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Long packageId,
            @RequestParam(required = false) Boolean active,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<QuotationListResponse> quotations = quotationService.getAllQuotations(search, status, customerId, packageId, active, pageable);
        return ResponseEntity.ok(ApiResponse.ok("Quotations fetched successfully", quotations));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get full details of a specific quotation")
    public ResponseEntity<ApiResponse<QuotationDetailResponse>> getQuotationById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Quotation fetched successfully", quotationService.getQuotationById(id)));
    }

    @PostMapping
    @Operation(summary = "Create a new quotation against a customer")
    public ResponseEntity<ApiResponse<QuotationDetailResponse>> createQuotation(
            @Valid @RequestBody QuotationRequest request,
            @AuthenticationPrincipal UserDetails admin) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Quotation created", quotationService.createQuotation(request, admin.getUsername())));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing quotation")
    public ResponseEntity<ApiResponse<QuotationDetailResponse>> updateQuotation(
            @PathVariable Long id,
            @Valid @RequestBody QuotationRequest request,
            @AuthenticationPrincipal UserDetails admin) {
        return ResponseEntity.ok(ApiResponse.ok("Quotation updated", quotationService.updateQuotation(id, request, admin.getUsername())));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Change a quotation's status")
    public ResponseEntity<ApiResponse<QuotationDetailResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody QuotationStatusUpdateRequest request,
            @AuthenticationPrincipal UserDetails admin) {
        return ResponseEntity.ok(ApiResponse.ok("Quotation status updated",
                quotationService.updateStatus(id, request.getStatus(), admin.getUsername())));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deactivate a quotation")
    public ResponseEntity<ApiResponse<Void>> deactivateQuotation(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails admin) {
        quotationService.deactivateQuotation(id, admin.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Quotation deactivated"));
    }

    @GetMapping("/{id}/pdf")
    @Operation(summary = "Download the quotation as a branded PDF")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable Long id) {
        byte[] pdf = quotationService.generatePdf(id);
        String filename = "quotation-" + id + ".pdf";
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(filename).build().toString())
                .body(pdf);
    }

    @PostMapping("/{id}/send-email")
    @Operation(summary = "Email the quotation PDF to the customer; transitions DRAFT to SENT")
    public ResponseEntity<ApiResponse<Void>> sendEmail(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails admin) {
        quotationService.sendQuotationEmail(id, admin.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Quotation emailed to the customer"));
    }

    @PostMapping("/{id}/whatsapp-link")
    @Operation(summary = "Get a wa.me share link (no WhatsApp Business API) with a pre-filled message and a public PDF link")
    public ResponseEntity<ApiResponse<WhatsAppLinkResponse>> getWhatsAppLink(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails admin) {
        return ResponseEntity.ok(ApiResponse.ok("WhatsApp link generated", quotationService.generateWhatsAppLink(id, admin.getUsername())));
    }

    @PatchMapping("/{id}/approval")
    @Operation(summary = "Approve or reject a quotation pending discount approval")
    public ResponseEntity<ApiResponse<QuotationDetailResponse>> updateApproval(
            @PathVariable Long id,
            @Valid @RequestBody ApprovalUpdateRequest request,
            @AuthenticationPrincipal UserDetails admin) {
        return ResponseEntity.ok(ApiResponse.ok("Approval status updated",
                quotationService.updateApproval(id, request.getApprovalStatus(), admin.getUsername())));
    }
}
