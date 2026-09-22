#!/bin/bash
set -e

echo "=================================================="
echo " Starting WeJoinLife Production Environment"
echo " Backend Target: Java 25 (Spring Boot API :8080)"
echo " Frontend Target: React / Vite Portal (:3000)"
echo "=================================================="

# Function to handle graceful shutdown
cleanup() {
    echo "Stopping background processes..."
    if [ -n "$JAVA_PID" ]; then
        kill "$JAVA_PID" 2>/dev/null || true
    fi
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start Spring Boot API in background
echo "Starting Spring Boot API service on port 8080..."
java -Djava.security.egd=file:/dev/./urandom -jar /app/app.jar &
JAVA_PID=$!

# Start React Frontend via 'serve'
echo "Starting React Frontend on port 3000..."
cd /app/frontend
serve -s dist -l 3000
