# --- Stage 1: Build Frontend ---
FROM node:20 AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install --legacy-peer-deps
COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# --- Stage 2: Build Backend ---
FROM eclipse-temurin:17-jdk-jammy AS backend-build
WORKDIR /app
COPY backend/ ./backend/
# Fix line endings and ensure mvnw is runnable
RUN cd backend && sed -i 's/\r$//' mvnw && chmod +x mvnw
# Copy frontend assets directly into the correct Maven resource folder
RUN mkdir -p backend/src/main/resources/static
COPY --from=frontend-build /app/frontend/dist/ ./backend/src/main/resources/static/
# Build the JAR with memory optimizations
WORKDIR /app/backend
RUN ./mvnw clean package -DskipTests -Dmaven.main.skip=false -Dspring-boot.repackage.skip=false

# --- Stage 3: Run Application ---
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=backend-build /app/backend/target/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 10000
# Ensure app listens on the PORT provided by Render
ENTRYPOINT ["java", "-Dserver.port=${PORT:10000}", "-jar", "app.jar"]
