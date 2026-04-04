package com.tourtravel.security;

import com.tourtravel.entity.User;
import com.tourtravel.repository.UserRepository;
import com.tourtravel.service.RefreshTokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Map;

/**
 * Handles the redirect after successful Google OAuth2 login.
 * Creates the user in the DB if they don't exist, then issues a JWT
 * and redirects the frontend with the token in the URL fragment.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String email    = (String) attributes.get("email");
        String name     = (String) attributes.get("name");
        String googleId = (String) attributes.get("sub");
        String picture  = (String) attributes.get("picture");

        // Find or create the user
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> userRepository.save(
                        User.builder()
                                .email(email)
                                .name(name)
                                .oauthId(googleId)
                                .provider("google")
                                .profileImageUrl(picture)
                                .role(User.Role.USER)
                                .active(true)
                                .build()));

        // Update profile image if changed
        if (!picture.equals(user.getProfileImageUrl())) {
            user.setProfileImageUrl(picture);
            userRepository.save(user);
        }

        // Generate JWT
        String accessToken  = jwtTokenProvider.generateTokenFromEmail(email);
        String refreshToken = refreshTokenService.createRefreshToken(user).getToken();

        log.info("OAuth2 login succeeded for user: {}", email);

        // Redirect to frontend with tokens in query params
        String redirectUrl = UriComponentsBuilder
                .fromUriString(frontendUrl + "/auth/oauth2/callback")
                .queryParam("token", accessToken)
                .queryParam("refreshToken", refreshToken)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
