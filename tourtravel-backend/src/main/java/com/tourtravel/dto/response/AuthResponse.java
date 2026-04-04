package com.tourtravel.dto.response;

import com.tourtravel.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO returned after successful authentication (login/register/OTP verify/OAuth2).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    @Builder.Default
    private String tokenType = "Bearer";
    private long expiresIn;          // ms
    private UserSummary user;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserSummary {
        private Long id;
        private String name;
        private String email;
        private String phone;
        private String role;
        private String profileImageUrl;
    }

    public static UserSummary fromUser(User user) {
        return UserSummary.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .profileImageUrl(user.getProfileImageUrl())
                .build();
    }
}
