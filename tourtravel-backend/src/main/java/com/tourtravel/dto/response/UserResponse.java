package com.tourtravel.dto.response;

import com.tourtravel.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Full user profile response DTO.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private String provider;
    private String profileImageUrl;
    private boolean active;
    private LocalDateTime createdAt;

    public static UserResponse fromEntity(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .provider(user.getProvider())
                .profileImageUrl(user.getProfileImageUrl())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
