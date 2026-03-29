# --- Stage 1: Build Frontend ---
FROM node:20-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend/ ./
RUN npm run build

# --- Stage 2: Build Backend ---
FROM eclipse-temurin:17-jdk-jammy AS backend-build
WORKDIR /app
# Copy the built frontend dist to the backend resources so it gets bundled
COPY --from=frontend-build /app/frontend/dist /app/backend/src/main/resources/static
COPY backend/ /app/backend/
WORKDIR /app/backend
# Ensure mvnw is executable and has Linux line endings
RUN sed -i 's/\r$//' mvnw
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# --- Stage 3: Run Application ---
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=backend-build /app/backend/target/*.jar app.jar
EXPOSE 10000
ENTRYPOINT ["java", "-jar", "app.jar"]
