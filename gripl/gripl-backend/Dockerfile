
FROM maven:3.8.6-eclipse-temurin-17 AS builder
WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

RUN mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="install-deps"

FROM eclipse-temurin:17-jre
WORKDIR /app

libxcursor1\                                                                ║
gripl-backend   | ║         libgtk-3-0t64\                                                                          ║
gripl-backend   | ║         libpangocairo-1.0-0\                                                                    ║
gripl-backend   | ║         libcairo-gobject2\                                                                      ║
gripl-backend   | ║         libgdk-pixbuf-2.0-0



RUN apt-get update && apt-get install -y \
      libglib2.0-0 \
      libnss3 \
      libnspr4 \
      libdbus-1-3 \
      libatk1.0-0 \
      libatk-bridge2.0-0 \
      libcups2 \
      libdrm2 \
      libatspi2.0-0 \
      libx11-6 \
      libxcomposite1 \
      libxdamage1 \
      libxext6 \
      libxfixes3 \
      libxrandr2 \
      libgbm1 \
      libxcb1 \
      libxkbcommon0 \
      libpango-1.0-0 \
      libcairo2 \
      libasound2t64 \
      libxcursor1 \
      libgtk-3-0t64 \
      libpangocairo-1.0-0 \
      libcairo-gobject2 \
      libgdk-pixbuf-2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/*.jar ./app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
