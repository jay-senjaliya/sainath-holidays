# Stage 1: Build the application
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app
# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B
# Build the application
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create the runtime image
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
# Copy the built jar from the builder stage
COPY --from=builder /app/target/*.jar app.jar
# Expose the internal port (matches application-prod.yml)
EXPOSE 8080
# Run the application with prod profile active
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=prod"]
