package com.tourtravel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Main entry point for the Tour & Travel Agency backend application.
 * Caching (Redis) and async execution are enabled at the application level.
 */
@SpringBootApplication
@EnableCaching
@EnableAsync
public class TourTravelApplication {

    public static void main(String[] args) {
        SpringApplication.run(TourTravelApplication.class, args);
    }
}
