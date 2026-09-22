# ==============================================================================
# WEJOINLIFE MULTI-STAGE PRODUCTION DOCKERFILE
# Architecture matches eda-health-hub:
# Stage 1: Java 25 Maven build for Spring Boot Backend
# Stage 2: Node.js build for React/Vite Frontend
# Stage 3: Unified Production Runtime (Spring Boot API + Node.js 'serve')
# ==============================================================================

# --- STAGE 1: Backend Build (Cache Dependencies) ---
FROM eclipse-temurin:25 AS backend-builder
WORKDIR /app/backend

# Copy Maven files first to leverage Docker layer caching
COPY backend/pom.xml backend/mvnw ./
COPY backend/.mvn .mvn

# Fix Windows CRLF line endings and set execute permissions
RUN sed -i 's/\r$//' ./mvnw && chmod +x ./mvnw

# Cache Maven dependencies
RUN ./mvnw dependency:go-offline -B || true

# Copy source and build executable JAR without running tests
COPY backend/src src
RUN ./mvnw clean package -DskipTests

# --- STAGE 2: Frontend Build (Cache Dependencies) ---
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy package descriptors first to cache npm dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy frontend source and build with build-time environment args
COPY frontend .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# --- STAGE 3: Final Production Image ---
FROM eclipse-temurin:25

# Install Node.js runtime and necessary utilities
RUN apt-get update && apt-get install -y \
    curl wget procps && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install 'serve' globally for high-performance static SPA serving
RUN npm install -g serve

WORKDIR /app

# Create dedicated uploads directory
RUN mkdir -p /opt/uploads/public /opt/uploads/private && chmod -R 775 /opt/uploads
VOLUME ["/opt/uploads"]

# Copy built backend executable JAR
COPY --from=backend-builder /app/backend/target/*.jar /app/app.jar

# Copy built frontend static bundle
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Copy entrypoint script and normalize line endings
COPY start.sh /app/start.sh
RUN sed -i 's/\r$//' /app/start.sh && chmod +x /app/start.sh

# Expose backend API (8080) and frontend Portal (3000)
EXPOSE 8080 3000

CMD ["/app/start.sh"]
