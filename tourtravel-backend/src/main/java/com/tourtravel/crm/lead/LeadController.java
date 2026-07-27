package com.tourtravel.crm.lead;

import com.tourtravel.crm.customer.Customer;
import com.tourtravel.crm.lead.Lead.LeadStatus;
import com.tourtravel.crm.lead.dto.AssignLeadRequest;
import com.tourtravel.crm.lead.dto.LeadDetailResponse;
import com.tourtravel.crm.lead.dto.LeadListResponse;
import com.tourtravel.crm.lead.dto.LeadRequest;
import com.tourtravel.crm.lead.dto.LeadStatusUpdateRequest;
import com.tourtravel.dto.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Admin-only CRM Lead endpoints. Dedicated controller, same rationale as
 * CustomerController — keeps the CRM module out of the shared AdminController.
 * Falls under SecurityConfig's existing "/api/v1/admin/**" -> hasRole("ADMIN") rule.
 */
@RestController
@RequestMapping("/api/v1/admin/leads")
@RequiredArgsConstructor
@Tag(name = "Admin - Leads", description = "CRM lead management: search, CRUD, status/pipeline, and assignment")
@SecurityRequirement(name = "bearerAuth")
public class LeadController {

    private final LeadService leadService;

    @GetMapping
    @Operation(summary = "Search/list leads with optional filters, sorting, and pagination")
    public ResponseEntity<ApiResponse<Page<LeadListResponse>>> getAllLeads(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) LeadStatus status,
            @RequestParam(required = false) Customer.CustomerSource source,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Long assignedToId,
            @RequestParam(required = false) Boolean active,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<LeadListResponse> leads = leadService.getAllLeads(search, status, source, customerId, assignedToId, active, pageable);
        return ResponseEntity.ok(ApiResponse.ok("Leads fetched successfully", leads));
    }

    @GetMapping("/pipeline")
    @Operation(summary = "Get all active leads grouped by pipeline status, for the Kanban board")
    public ResponseEntity<ApiResponse<Map<LeadStatus, List<LeadListResponse>>>> getPipeline() {
        return ResponseEntity.ok(ApiResponse.ok("Pipeline fetched successfully", leadService.getPipeline()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get full details of a specific lead")
    public ResponseEntity<ApiResponse<LeadDetailResponse>> getLeadById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Lead fetched successfully", leadService.getLeadById(id)));
    }

    @PostMapping
    @Operation(summary = "Create a new lead against a customer")
    public ResponseEntity<ApiResponse<LeadDetailResponse>> createLead(
            @Valid @RequestBody LeadRequest request,
            @AuthenticationPrincipal UserDetails admin) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Lead created", leadService.createLead(request, admin.getUsername())));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing lead")
    public ResponseEntity<ApiResponse<LeadDetailResponse>> updateLead(
            @PathVariable Long id,
            @Valid @RequestBody LeadRequest request,
            @AuthenticationPrincipal UserDetails admin) {
        return ResponseEntity.ok(ApiResponse.ok("Lead updated", leadService.updateLead(id, request, admin.getUsername())));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Move a lead to a different pipeline stage")
    public ResponseEntity<ApiResponse<LeadDetailResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody LeadStatusUpdateRequest request,
            @AuthenticationPrincipal UserDetails admin) {
        return ResponseEntity.ok(ApiResponse.ok("Lead status updated",
                leadService.updateStatus(id, request.getStatus(), admin.getUsername())));
    }

    @PatchMapping("/{id}/assign")
    @Operation(summary = "Assign (or unassign, by sending a null assignedToId) a lead to a staff member")
    public ResponseEntity<ApiResponse<LeadDetailResponse>> assignLead(
            @PathVariable Long id,
            @RequestBody AssignLeadRequest request,
            @AuthenticationPrincipal UserDetails admin) {
        return ResponseEntity.ok(ApiResponse.ok("Lead assignment updated",
                leadService.assignLead(id, request.getAssignedToId(), admin.getUsername())));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deactivate a lead")
    public ResponseEntity<ApiResponse<Void>> deactivateLead(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails admin) {
        leadService.deactivateLead(id, admin.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Lead deactivated"));
    }
}
