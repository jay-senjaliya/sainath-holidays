package com.tourtravel.controller;

import com.tourtravel.dto.response.ApiResponse;
import com.tourtravel.dto.response.UserResponse;
import com.tourtravel.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Minimal admin-facing user directory. Today it only backs the CRM Lead
 * assignment dropdown ("which staff member owns this lead") — not a full
 * staff-management module, which belongs to the Enterprise phase.
 */
@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
@Tag(name = "Admin - Users", description = "Read-only staff directory (used for assignment dropdowns)")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    @GetMapping("/assignable")
    @Operation(summary = "List active staff (ADMIN role) eligible to be assigned leads")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAssignableStaff() {
        return ResponseEntity.ok(ApiResponse.ok("Assignable staff fetched successfully", userService.getAssignableStaff()));
    }
}
