# 1) Build com Maven + JDK 17
FROM maven:3-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# 2) Runtime com OpenJDK 17
FROM openjdk:17 AS runtime
WORKDIR /app
COPY --from=build /app/target/app.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
