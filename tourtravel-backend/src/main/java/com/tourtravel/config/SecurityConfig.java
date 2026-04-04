package com.tourtravel.config;

import com.tourtravel.security.JwtAuthEntryPoint;
import com.tourtravel.security.JwtAuthenticationFilter;
import com.tourtravel.security.OAuth2SuccessHandler;
import com.tourtravel.util.AppConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Central Spring Security configuration.
 * - Stateless (JWT, no sessions)
 * - Role-based method security enabled via @PreAuthorize
 * - OAuth2 login with custom success handler
 * - Public endpoints whitelisted; all others require authentication
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthEntryPoint jwtAuthEntryPoint;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF — not needed for stateless REST APIs using JWT
            .csrf(AbstractHttpConfigurer::disable)

            // CORS handled by CorsConfig bean
            .cors(cors -> {})

            // Stateless session — never create HTTP sessions
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Custom 401 JSON response for unauthenticated requests
            .exceptionHandling(ex ->
                ex.authenticationEntryPoint(jwtAuthEntryPoint))

            // URL authorization rules
            .authorizeHttpRequests(auth -> auth
                // Public routes — auth, swagger, health, and read-only package/vehicle/hotel listings
                .requestMatchers(AppConstants.AUTH_WHITELIST).permitAll()
                .requestMatchers(HttpMethod.GET,
                    "/api/v1/packages/**",
                    "/api/v1/vehicles",
                    "/api/v1/hotels",
                    "/api/v1/packages/map"
                ).permitAll()
                // Admin-only routes
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                // Everything else requires authentication
                .anyRequest().authenticated()
            )

            // OAuth2 — Google login
            .oauth2Login(oauth2 -> oauth2
                .authorizationEndpoint(ep ->
                    ep.baseUri("/api/v1/auth/oauth2/authorize"))
                .redirectionEndpoint(ep ->
                    ep.baseUri("/api/v1/auth/oauth2/callback/*"))
                .successHandler(oAuth2SuccessHandler)
            )

            // Add JWT filter before Spring's username/password filter
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

            // Wire in our custom auth provider (BCrypt password validation)
            .authenticationProvider(authenticationProvider());

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
