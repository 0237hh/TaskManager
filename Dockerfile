FROM openjdk:17.0.2

COPY src/main/taskmanager-fe/dist /TaskManager/src/main/resources/static
COPY build/libs/TaskManager-0.0.1-SNAPSHOT.jar /app/app.jar

WORKDIR /app
ENTRYPOINT ["java", "-XX:-UseContainerSupport", "-Duser.timezone=Asia/Seoul", "-jar", "/app/app.jar"]

EXPOSE 8080