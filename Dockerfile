FROM openjdk:17-jdk-slim AS build

WORKDIR /TaskManager

COPY src/main/taskmanager-fe/dist /TaskManager/src/main/resources/static

COPY build/libs/TaskManager-0.0.1-SNAPSHOT.jar /app/app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]

EXPOSE 8080
