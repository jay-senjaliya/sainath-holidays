package com.tourtravel.config;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * SpringDoc OpenAPI (Swagger UI) configuration.
 * Adds JWT Bearer auth globally so all protected endpoints can be tested from the UI.
 */
@Configuration
@SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT"
)
public class OpenApiConfig {

    @Value("${server.port:8080}")
    private String serverPort;

    @Bean
    public OpenAPI tourTravelOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Tour & Travel Agency API")
                .description("Production-grade REST API for Tour & Travel Agency — packages, enquiries, hotels, vehicles, and auth.")
                .version("v1.0.0")
                .contact(new Contact().name("TourTravel Dev Team").email("dev@tourtravel.com"))
                .license(new License().name("Proprietary")))
            .servers(List.of(
                new Server().url("http://localhost:" + serverPort).description("Local Dev"),
                new Server().url("https://api.tourtravel.com").description("Production")
            ));
    }
}
