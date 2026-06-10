# Stage 1: Build the Spring Boot app
FROM maven:3.9.8-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
COPY src src

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Stage 2: Run the app
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]