package com.tourtravel.controller;

import com.tourtravel.dto.request.LoginRequest;
import com.tourtravel.dto.request.RefreshTokenRequest;
import com.tourtravel.dto.request.RegisterRequest;
import com.tourtravel.dto.request.SendOtpRequest;
import com.tourtravel.dto.request.VerifyOtpRequest;
import com.tourtravel.dto.response.ApiResponse;
import com.tourtravel.dto.response.AuthResponse;
import com.tourtravel.dto.response.UserResponse;
import com.tourtravel.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication controller.
 *
 * Endpoints:
 *  POST /api/v1/auth/register          — Email/password registration
 *  POST /api/v1/auth/login             — Email/password login
 *  POST /api/v1/auth/otp/send          — Send OTP to phone
 *  POST /api/v1/auth/otp/verify        — Verify OTP & login
 *  POST /api/v1/auth/refresh           — Refresh access token
 *  POST /api/v1/auth/logout            — Revoke refresh token
 *  GET  /api/v1/auth/me                — Get current user profile
 *
 * Google OAuth2 flow is handled by Spring Security:
 *  GET /api/v1/auth/oauth2/authorize/google → Spring redirect to Google
 *  Google redirects to → /api/v1/auth/oauth2/callback/google → OAuth2SuccessHandler
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Login, registration, OTP, and token management")
public class AuthController {

    private final AuthService authService;

    // -------------------------------------------------------
    // 1. Email/Password Registration
    // -------------------------------------------------------
    @PostMapping("/register")
    @Operation(summary = "Register a new user with email and password")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {

        AuthResponse authResponse = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Registration successful", authResponse));
    }

    // -------------------------------------------------------
    // 2. Email/Password Login
    // -------------------------------------------------------
    @PostMapping("/login")
    @Operation(summary = "Login with email and password")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        AuthResponse authResponse = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", authResponse));
    }

    // -------------------------------------------------------
    // 3. Send OTP
    // -------------------------------------------------------
    @PostMapping("/otp/send")
    @Operation(summary = "Send OTP to phone number for phone-based login")
    public ResponseEntity<ApiResponse<Void>> sendOtp(
            @Valid @RequestBody SendOtpRequest request) {

        authService.sendOtp(request.getPhone());
        return ResponseEntity.ok(ApiResponse.ok("OTP sent successfully. Valid for 5 minutes."));
    }

    // -------------------------------------------------------
    // 4. Verify OTP & Login
    // -------------------------------------------------------
    @PostMapping("/otp/verify")
    @Operation(summary = "Verify OTP and login (creates account if first time)")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {

        AuthResponse authResponse = authService.verifyOtpAndLogin(request);
        return ResponseEntity.ok(ApiResponse.ok("OTP verified. Login successful.", authResponse));
    }

    // -------------------------------------------------------
    // 5. Refresh Token
    // -------------------------------------------------------
    @PostMapping("/refresh")
    @Operation(summary = "Refresh the access token using a valid refresh token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request) {

        AuthResponse authResponse = authService.refreshToken(request.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.ok("Token refreshed", authResponse));
    }

    // -------------------------------------------------------
    // 6. Logout
    // -------------------------------------------------------
    @PostMapping("/logout")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Logout — revokes the refresh token for the current user")
    public ResponseEntity<ApiResponse<Void>> logout(
            @AuthenticationPrincipal UserDetails userDetails) {

        authService.logout(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Logged out successfully."));
    }

    // -------------------------------------------------------
    // 7. Get Current User Profile
    // -------------------------------------------------------
    @GetMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get currently authenticated user's profile")
    public ResponseEntity<ApiResponse<UserResponse>> me(
            @AuthenticationPrincipal UserDetails userDetails) {

        var user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Profile fetched", UserResponse.fromEntity(user)));
    }
}
