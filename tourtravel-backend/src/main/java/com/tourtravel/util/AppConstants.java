package com.tourtravel.util;

/**
 * Application-wide constants to avoid magic strings/numbers.
 */
public final class AppConstants {

    private AppConstants() {}

    // Pagination defaults
    public static final int DEFAULT_PAGE_SIZE = 12;
    public static final int MAX_PAGE_SIZE = 100;
    public static final String DEFAULT_SORT_BY = "createdAt";
    public static final String DEFAULT_SORT_DIR = "desc";

    // JWT
    public static final String JWT_HEADER = "Authorization";
    public static final String JWT_PREFIX = "Bearer ";

    // Redis cache names
    public static final String CACHE_PACKAGES = "packages";
    public static final String CACHE_PACKAGE_DETAIL = "package_detail";
    public static final String CACHE_VEHICLES = "vehicles";
    public static final String CACHE_HOTELS = "hotels";

    // Role strings (Spring Security format)
    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    public static final String ROLE_USER  = "ROLE_USER";

    // API paths
    public static final String API_V1 = "/api/v1";
    public static final String AUTH_WHITELIST[] = {
        "/api/v1/auth/**",
        "/api/v1/packages/**",
        "/api/v1/vehicles",
        "/api/v1/hotels",
        "/api/v1/quotations/shared/**",
        "/swagger-ui/**",
        "/v3/api-docs/**",
        "/actuator/health"
    };
}
