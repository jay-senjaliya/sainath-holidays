package com.tourtravel.service;

import com.tourtravel.exception.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * OTP service with dual storage strategy:
 *  - Production (Redis available): stores OTPs in Redis with TTL.
 *  - Dev (no Redis): stores OTPs in an in-memory ConcurrentHashMap with manual expiry.
 *
 * Key pattern: "otp:<phone>"
 */
@Service
@Slf4j
public class OtpService {

    private static final String OTP_KEY_PREFIX = "otp:";
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    @Value("${app.otp.expiry-minutes:5}")
    private long otpExpiryMinutes;

    @Value("${app.otp.length:6}")
    private int otpLength;

    /** Injected only when RedisConfig is active (non-dev profiles). */
    @Autowired(required = false)
    private RedisTemplate<String, String> redisTemplate;

    @Autowired
    private MailService mailService;

    /** In-memory fallback for local dev (no Redis). */
    private final Map<String, String> inMemoryOtpValues = new ConcurrentHashMap<>();
    private final Map<String, Long>   inMemoryOtpExpiry  = new ConcurrentHashMap<>();

    public String generateAndStoreOtp(String phone) {
        String otp = generateOtp();
        String key  = OTP_KEY_PREFIX + phone;

        if (redisTemplate != null) {
            redisTemplate.opsForValue().set(key, otp, Duration.ofMinutes(otpExpiryMinutes));
        } else {
            long expiresAt = Instant.now().getEpochSecond() + otpExpiryMinutes * 60;
            inMemoryOtpValues.put(key, otp);
            inMemoryOtpExpiry.put(key, expiresAt);
        }

        if (phone.contains("@")) {
            mailService.sendOtpEmail(phone, otp);
            log.info("📧 OTP sent via email to {} → {}", phone, otp);
        } else {
            log.info("📱 [DEV] OTP for {} → {}", phone, otp);
            // In production, you would call an SMS Gateway here
        }
        return otp;
    }

    public void verifyOtp(String phone, String otp) {
        String key = OTP_KEY_PREFIX + phone;
        String stored;

        if (redisTemplate != null) {
            stored = redisTemplate.opsForValue().get(key);
        } else {
            Long expiresAt = inMemoryOtpExpiry.get(key);
            if (expiresAt == null || Instant.now().getEpochSecond() > expiresAt) {
                inMemoryOtpValues.remove(key);
                inMemoryOtpExpiry.remove(key);
                stored = null;
            } else {
                stored = inMemoryOtpValues.get(key);
            }
        }

        if (stored == null) {
            throw new BadRequestException("OTP has expired or was not generated. Please request a new one.");
        }
        if (!stored.equals(otp)) {
            throw new BadRequestException("Invalid OTP. Please check and try again.");
        }

        if (redisTemplate != null) {
            redisTemplate.delete(key);
        } else {
            inMemoryOtpValues.remove(key);
            inMemoryOtpExpiry.remove(key);
        }
    }

    private String generateOtp() {
        int bound = (int) Math.pow(10, otpLength);
        int raw   = SECURE_RANDOM.nextInt(bound);
        return String.format("%0" + otpLength + "d", raw);
    }
}
