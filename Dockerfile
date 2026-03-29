# --- Stage 1: Build Frontend ---
FROM node:20 AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend/ ./
RUN npm run build

# --- Stage 2: Build Backend ---
FROM eclipse-temurin:17-jdk-jammy AS backend-build
WORKDIR /backend
# Copy the backend source
COPY backend/ .
# Fix line endings
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw
# Create the target static directory and copy frontend files
RUN mkdir -p src/main/resources/static
COPY --from=frontend-build /frontend/dist/ src/main/resources/static/
# Build the JAR
RUN ./mvnw clean package -DskipTests

# --- Stage 3: Run Application ---
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=backend-build /backend/target/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 10000
ENTRYPOINT ["java", "-jar", "app.jar"]
