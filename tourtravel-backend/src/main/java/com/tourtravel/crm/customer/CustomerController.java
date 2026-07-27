package com.tourtravel.crm.customer;

import com.tourtravel.crm.customer.dto.CustomerDetailResponse;
import com.tourtravel.crm.customer.dto.CustomerListResponse;
import com.tourtravel.crm.customer.dto.CustomerRequest;
import com.tourtravel.crm.customer.dto.TimelineEventResponse;
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

/**
 * Admin-only CRM Customer endpoints. Dedicated controller — kept separate from the
 * shared AdminController so the CRM module (Customer today, Lead/Followups/Tasks
 * later) doesn't keep growing that unrelated, already-large class.
 *
 * Falls under SecurityConfig's existing "/api/v1/admin/**" -> hasRole("ADMIN") rule,
 * so no security configuration changes were needed for this module.
 */
@RestController
@RequestMapping("/api/v1/admin/customers")
@RequiredArgsConstructor
@Tag(name = "Admin - Customers", description = "CRM customer management: search, CRUD, and activity timeline")
@SecurityRequirement(name = "bearerAuth")
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping
    @Operation(summary = "Search/list customers with optional filters, sorting, and pagination")
    public ResponseEntity<ApiResponse<Page<CustomerListResponse>>> getAllCustomers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Customer.CustomerSource source,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Boolean active,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<CustomerListResponse> customers = customerService.getAllCustomers(search, source, city, active, pageable);
        return ResponseEntity.ok(ApiResponse.ok("Customers fetched successfully", customers));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get full details of a specific customer")
    public ResponseEntity<ApiResponse<CustomerDetailResponse>> getCustomerById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Customer fetched successfully", customerService.getCustomerById(id)));
    }

    @PostMapping
    @Operation(summary = "Create a new customer")
    public ResponseEntity<ApiResponse<CustomerDetailResponse>> createCustomer(
            @Valid @RequestBody CustomerRequest request,
            @AuthenticationPrincipal UserDetails admin) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Customer created", customerService.createCustomer(request, admin.getUsername())));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing customer")
    public ResponseEntity<ApiResponse<CustomerDetailResponse>> updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody CustomerRequest request,
            @AuthenticationPrincipal UserDetails admin) {
        return ResponseEntity.ok(ApiResponse.ok("Customer updated", customerService.updateCustomer(id, request, admin.getUsername())));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deactivate a customer")
    public ResponseEntity<ApiResponse<Void>> deactivateCustomer(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails admin) {
        customerService.deactivateCustomer(id, admin.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Customer deactivated"));
    }

    @GetMapping("/{id}/timeline")
    @Operation(summary = "Get a customer's activity timeline (placeholder — populated by system events today, by Notes/Tasks/Followups later)")
    public ResponseEntity<ApiResponse<Page<TimelineEventResponse>>> getCustomerTimeline(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.ok("Timeline fetched successfully", customerService.getCustomerTimeline(id, pageable)));
    }
}
