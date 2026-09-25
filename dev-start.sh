#!/bin/bash

echo "=================================================="
echo " Starting WeJoinLife Development Environment"
echo "=================================================="

# Start Backend in watch / dev mode
echo "Starting Spring Boot Backend (Development Mode)..."
cd /app/backend
chmod +x ./mvnw
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev &

# Start Frontend with Vite Hot Module Replacement (HMR)
echo "Starting React Frontend (Vite Dev Mode on :3000)..."
cd /app/frontend
npm install
npm run dev -- --host 0.0.0.0 --port 3000 &

# Keep the container running
wait
