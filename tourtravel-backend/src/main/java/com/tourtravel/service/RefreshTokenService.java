package com.tourtravel.service;

import com.tourtravel.entity.RefreshToken;
import com.tourtravel.entity.User;
import com.tourtravel.exception.BadRequestException;
import com.tourtravel.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

/**
 * Manages JWT refresh token creation, rotation, and revocation.
 */
@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    @Value("${app.jwt.refresh-token-expiry-days}")
    private long refreshTokenExpiryDays;

    private final RefreshTokenRepository refreshTokenRepository;

    @Transactional
    public RefreshToken createRefreshToken(User user) {
        // Delete existing refresh token for this user (one-per-user policy)
        refreshTokenRepository.deleteByUser(user);

        RefreshToken token = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusSeconds(refreshTokenExpiryDays * 24 * 60 * 60))
                .build();

        return refreshTokenRepository.save(token);
    }

    @Transactional(readOnly = true)
    public RefreshToken verifyExpiration(String rawToken) {
        RefreshToken token = refreshTokenRepository.findByToken(rawToken)
                .orElseThrow(() -> new BadRequestException("Refresh token not found or already revoked."));

        if (token.isExpired()) {
            refreshTokenRepository.delete(token);
            throw new BadRequestException("Refresh token has expired. Please log in again.");
        }

        return token;
    }

    @Transactional
    public void revokeToken(User user) {
        refreshTokenRepository.deleteByUser(user);
    }
}
