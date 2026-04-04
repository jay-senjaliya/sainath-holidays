package com.tourtravel.service;

import com.tourtravel.dto.request.LoginRequest;
import com.tourtravel.dto.request.RegisterRequest;
import com.tourtravel.dto.request.VerifyOtpRequest;
import com.tourtravel.dto.response.AuthResponse;
import com.tourtravel.entity.RefreshToken;
import com.tourtravel.entity.User;
import com.tourtravel.exception.BadRequestException;
import com.tourtravel.exception.ResourceNotFoundException;
import com.tourtravel.repository.UserRepository;
import com.tourtravel.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Core authentication service.
 * Handles: email/password login, registration, OTP login, token refresh, and profile retrieval.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository        userRepository;
    private final PasswordEncoder       passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider      jwtTokenProvider;
    private final RefreshTokenService   refreshTokenService;
    private final OtpService            otpService;

    @Value("${app.jwt.access-token-expiry-ms}")
    private long accessTokenExpiryMs;

    // ---- Email/Password Registration ----

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with this email already exists.");
        }

        User user = userRepository.save(User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.USER)
                .provider("local")
                .active(true)
                .build());

        return buildAuthResponse(user, user.getEmail());
    }

    // ---- Email/Password Login ----

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        String accessToken = jwtTokenProvider.generateToken(auth);
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

        String refreshToken = refreshTokenService.createRefreshToken(user).getToken();

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(accessTokenExpiryMs)
                .user(AuthResponse.fromUser(user))
                .build();
    }

    // ---- Phone OTP — Send ----

    public void sendOtp(String phone) {
        // Rate limiting: prevent OTP spam — Redis already enforces TTL
        otpService.generateAndStoreOtp(phone);
    }

    // ---- Phone OTP — Verify & Login ----

    @Transactional
    public AuthResponse verifyOtpAndLogin(VerifyOtpRequest request) {
        // Will throw BadRequestException if OTP is wrong or expired
        otpService.verifyOtp(request.getPhone(), request.getOtp());

        // Find or create user
        User user = userRepository.findByPhone(request.getPhone())
                .orElseGet(() -> userRepository.save(
                        User.builder()
                                .phone(request.getPhone())
                                .name(request.getName() != null ? request.getName() : "User_" + request.getPhone().substring(request.getPhone().length() - 4))
                                .role(User.Role.USER)
                                .provider("phone")
                                .active(true)
                                .build()));

        return buildAuthResponse(user, user.getPhone());
    }

    // ---- Refresh Token Rotation ----

    @Transactional
    public AuthResponse refreshToken(String rawRefreshToken) {
        RefreshToken token = refreshTokenService.verifyExpiration(rawRefreshToken);
        User user = token.getUser();

        String newAccessToken  = jwtTokenProvider.generateTokenFromEmail(
                user.getEmail() != null ? user.getEmail() : user.getPhone());
        String newRefreshToken = refreshTokenService.createRefreshToken(user).getToken();

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .expiresIn(accessTokenExpiryMs)
                .user(AuthResponse.fromUser(user))
                .build();
    }

    // ---- Profile ----

    @Transactional(readOnly = true)
    public User getCurrentUser(String identifier) {
        return userRepository.findByEmail(identifier)
                .or(() -> userRepository.findByPhone(identifier))
                .orElseThrow(() -> new ResourceNotFoundException("User", "identifier", identifier));
    }

    // ---- Logout ----

    @Transactional
    public void logout(String identifier) {
        userRepository.findByEmail(identifier)
                .or(() -> userRepository.findByPhone(identifier))
                .ifPresent(refreshTokenService::revokeToken);
        log.info("User logged out: {}", identifier);
    }

    // ---- Private helpers ----

    private AuthResponse buildAuthResponse(User user, String subject) {
        String accessToken  = user.getEmail() != null
                ? jwtTokenProvider.generateTokenFromEmail(user.getEmail())
                : jwtTokenProvider.generateTokenFromPhone(user.getPhone());
        String refreshToken = refreshTokenService.createRefreshToken(user).getToken();

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(accessTokenExpiryMs)
                .user(AuthResponse.fromUser(user))
                .build();
    }
}
