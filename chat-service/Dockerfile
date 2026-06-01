FROM maven:3.9.8-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -B package -DskipTests

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/chat-service-0.0.1-SNAPSHOT.jar ./chat-service.jar
EXPOSE 8085
ENTRYPOINT ["java", "-jar", "chat-service.jar"]
