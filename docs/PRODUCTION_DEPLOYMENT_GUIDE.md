# WeJoinLife - Production Server Deployment Runbook

This document is the exact step-by-step guide to deploying and running **WeJoinLife** on a Linux production server (Ubuntu/Debian/CentOS/RHEL) alongside existing host services (Host Nginx, Host Tomcat, and Host MariaDB/MySQL).

---

## 1. System Architecture & Port Allocation

```mermaid
graph TD
    Client["User / Web Browser"] -->|HTTPS :443 / HTTP :80| HostNginx["Host Nginx (vconnectlive.com)"]
    
    HostNginx -->|/ (Default)| HostTomcat["Host Tomcat (:8080)<br/>Existing Legacy / J2EE Apps"]
    HostNginx -->|/wjl/ and /wjlapi/| DockerNginx["wejoinlife-nginx-prod (:8181)<br/>Frontline Docker Gateway"]
    
    subgraph DockerNetwork ["Internal Docker Network (wjl-network)"]
        DockerNginx -->|/wjl/| ReactFrontend["React / Vite Portal (:3000)<br/>Static SPA via Node 'serve'"]
        DockerNginx -->|/wjlapi/| SpringBackend["Spring Boot REST API (:8080)<br/>Java 25 Embedded Engine"]
    end
    
    subgraph HostDatabase ["Host Machine Services"]
        SpringBackend -->|172.% to host.docker.internal:3306| MariaDB[("Host MariaDB / MySQL Server (:3306)<br/>Accessible strictly to Docker subnet")]
    end
```

### Port Allocation (Zero Conflicts)
| Service | Location | Port | Description |
| :--- | :--- | :--- | :--- |
| **Host Nginx** | Linux Host | `80` & `443` | Main reverse proxy for `vconnectlive.com` and SSL termination |
| **Host Tomcat** | Linux Host | `8080` | Existing applications and login system (completely untouched) |
| **Host MariaDB** | Linux Host | `3306` | Main database server |
| **Docker Nginx** | Docker Container | `8181:80` | Listens on host `8181`, handles internal Docker traffic |
| **Spring Boot API**| Docker Container | `8080` (Internal) | Isolated inside `wjl-network` (does NOT touch host port 8080) |
| **React Frontend** | Docker Container | `3000` (Internal) | Isolated inside `wjl-network` |

---

## 2. Step-by-Step Server Setup (Post-Git Clone)

### Step 1: Navigate into Project & Set Script Permissions
```bash
cd ~/wejoinlifenew
chmod +x start.sh dev-start.sh backend/mvnw
```

---

### Step 2: Configure Production `.env` File
Create your production `.env` from the example:
```bash
cp .env.example .env
nano .env
```

Set the database connection and security keys:
```ini
NODE_ENV=production

# Database Connection (connects to Host MariaDB/MySQL)
DB_HOST=host.docker.internal
DB_PORT=3306
DB_NAME=vconnect_prod_portal
DB_USERNAME=etn
DB_PASSWORD=your_etn_password_here

# Multi-Database Schema Mapping
PORTAL_DB=vconnect_prod_portal
CATALOG_DB=vconnect_prod_catalog
VCONNECT_DB=vconnect
CART_COOKIE_NAME=vconnect_cart

# Security & Cookies
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_EXPIRATION=86400000
JWT_COOKIE_NAME=wjl_jwt
JWT_COOKIE_DOMAIN=.vconnectlive.com
CLIENT_PASS_SALT=38fc4120
```
*(Press `Ctrl + O`, `Enter` to save, and `Ctrl + X` to exit)*.

---

### Step 3: Configure Host MariaDB / MySQL Permissions

Docker containers connect to host services through the internal Docker bridge subnet (`172.x.x.x`). By default, users created with `localhost` or `192.168.x.x` will be rejected by MariaDB.

#### 1. Check Docker Subnet on Host
```bash
ip addr show docker0
```
*(Confirms Docker subnet is `172.17.0.1/16`)*.

#### 2. Log into MariaDB as Root
```bash
sudo mysql
```

#### 3. Create the Database User for Docker Subnet (`172.%`)
Run these SQL commands to grant `etn` permission strictly from Docker:
```sql
-- 1. Create user for Docker subnet (replace 'your_password' with real password, or '' if blank):
CREATE USER 'etn'@'172.%' IDENTIFIED BY 'your_password';

-- 2. Grant permissions on WeJoinLife databases:
GRANT ALL PRIVILEGES ON vconnect.* TO 'etn'@'172.%';
GRANT ALL PRIVILEGES ON vconnect_catalog.* TO 'etn'@'172.%';
GRANT ALL PRIVILEGES ON vconnect_catapulte.* TO 'etn'@'172.%';
GRANT ALL PRIVILEGES ON vconnect_commons.* TO 'etn'@'172.%';
GRANT ALL PRIVILEGES ON vconnect_expert_system.* TO 'etn'@'172.%';
GRANT ALL PRIVILEGES ON vconnect_forms.* TO 'etn'@'172.%';
GRANT ALL PRIVILEGES ON vconnect_functions.* TO 'etn'@'172.%';
GRANT ALL PRIVILEGES ON vconnect_pages.* TO 'etn'@'172.%';
GRANT ALL PRIVILEGES ON vconnect_portal.* TO 'etn'@'172.%';
GRANT ALL PRIVILEGES ON vconnect_prod_catalog.* TO 'etn'@'172.%';
GRANT ALL PRIVILEGES ON vconnect_prod_portal.* TO 'etn'@'172.%';
GRANT ALL PRIVILEGES ON vconnect_prod_shop.* TO 'etn'@'172.%';
GRANT ALL PRIVILEGES ON vconnect_shop.* TO 'etn'@'172.%';
GRANT ALL PRIVILEGES ON vconnect_sync.* TO 'etn'@'172.%';

-- 3. Apply changes:
FLUSH PRIVILEGES;
EXIT;
```

---

### Step 4: Verify Docker Compose Configuration (`docker-compose.prod.yml`)

Ensure `docker-compose.prod.yml` has the following battle-tested configuration:
```yaml
version: '3.8'

services:
  wejoinlife-app:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - VITE_API_URL=${VITE_API_URL:-}
    container_name: wejoinlife-app-prod
    restart: always
    extra_hosts:
      - "host.docker.internal:host-gateway"
    expose:
      - "3000"  # React Frontend (accessible internally to Docker Nginx)
      - "8080"  # Spring Boot REST API (accessible internally to Docker Nginx)
    environment:
      # Database Configuration
      - DB_HOST=${DB_HOST:-host.docker.internal}
      - DB_PORT=${DB_PORT:-3306}
      - DB_NAME=${DB_NAME:-vconnect_prod_portal}
      - DB_USERNAME=${DB_USERNAME}
      - DB_PASSWORD=${DB_PASSWORD}
      - SPRING_DATASOURCE_URL=jdbc:mysql://${DB_HOST:-host.docker.internal}:${DB_PORT:-3306}/${DB_NAME:-vconnect_prod_portal}?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
      - SPRING_DATASOURCE_USERNAME=${DB_USERNAME}
      - SPRING_DATASOURCE_PASSWORD=${DB_PASSWORD}

      # Security & JWT Configuration
      - JWT_SECRET=${JWT_SECRET}
      - JWT_EXPIRATION=${JWT_EXPIRATION:-86400000}
      - JWT_COOKIE_DOMAIN=${JWT_COOKIE_DOMAIN:-}
      - JWT_COOKIE_NAME=${JWT_COOKIE_NAME:-wjl_jwt}
      - CLIENT_PASS_SALT=${CLIENT_PASS_SALT:-38fc4120}

      # Multi-Database Mapping
      - PORTAL_DB=${PORTAL_DB:-vconnect_prod_portal}
      - CATALOG_DB=${CATALOG_DB:-vconnect_prod_catalog}
      - VCONNECT_DB=${VCONNECT_DB:-vconnect}
      - CART_COOKIE_NAME=${CART_COOKIE_NAME:-vconnect_cart}

      - NODE_ENV=production
    volumes:
      - ./uploads:/opt/uploads
    networks:
      - wjl-network

  nginx:
    build:
      context: .
      dockerfile: Dockerfile.nginx
    container_name: wejoinlife-nginx-prod
    restart: always
    depends_on:
      - wejoinlife-app
    ports:
      - "8181:80"   # Host port 8181 -> Docker Nginx (avoids host 80/443 conflict)
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    networks:
      - wjl-network

networks:
  wjl-network:
    name: wjl-network
    driver: bridge
```

---

### Step 5: Verify Docker `nginx.conf` (Frontend & API Routing)

Ensure `nginx.conf` has the critical trailing slash on `proxy_pass http://wejoinlife-app:3000/;` so static assets are properly mapped:

```nginx
        # Root redirect to React Portal base path
        location = / {
            return 301 /wjl/;
        }

        location = /wjl {
            return 301 /wjl/;
        }

        # React Frontend Application (served under /wjl/)
        location /wjl/ {
            proxy_pass http://wejoinlife-app:3000/;   # Trailing slash strips /wjl/ for Node 'serve'
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_read_timeout 90s;
        }

        # Spring Boot Backend API (primary /wjlapi/ routes)
        location /wjlapi/ {
            proxy_pass http://wejoinlife-app:8080/wjlapi/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_read_timeout 120s;
        }
```

---

### Step 6: Configure Host Nginx (`vconnectlive.com`)

In your main host Nginx configuration file (e.g. `/etc/nginx/conf.d/vconnectlive.conf` or `/etc/nginx/sites-available/...`), add these two proxy blocks inside your `server { ... }` block:

```nginx
    # 1. Forward React Portal traffic to Docker Nginx
    location /wjl/ {
        proxy_pass http://127.0.0.1:8181/wjl/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 2. Forward Spring Boot API traffic to Docker Nginx
    location /wjlapi/ {
        proxy_pass http://127.0.0.1:8181/wjlapi/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
```

Test and reload Host Nginx:
```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

### Step 7: Build & Launch Docker Containers
```bash
cd ~/wejoinlifenew
docker compose -f docker-compose.prod.yml up -d --build
```

---

### Step 8: Verify Operations & Logs

#### 1. Check Container Status
```bash
docker compose -f docker-compose.prod.yml ps
```
Expected: Both `wejoinlife-app-prod` and `wejoinlife-nginx-prod` are **Up**.

#### 2. Check Port Bindings
```bash
docker port wejoinlife-nginx-prod
```
Expected: `80/tcp -> 0.0.0.0:8181`

#### 3. Test HTTP Responses Locally
```bash
# Test Frontend:
curl -I http://127.0.0.1:8181/wjl/
# (Returns HTTP/1.1 200 OK)

# Test Backend API:
curl -I http://127.0.0.1:8181/wjlapi/api/v1/auth/me
# (Returns HTTP/1.1 401 Unauthorized or 200 OK)
```

#### 4. Check Backend Startup Logs
```bash
docker logs --tail 50 wejoinlife-app-prod
```
Expected: `Started WejoinlifeApiApplication in ... seconds (process running for ...)`

---

## 3. Routine Operations & Maintenance

### Pulling New Updates from Git
```bash
cd ~/wejoinlifenew
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build
```

### Restarting Containers
```bash
# Restart everything:
docker compose -f docker-compose.prod.yml restart

# Restart only Nginx (takes 1 second):
docker compose -f docker-compose.prod.yml restart nginx

# Restart only Spring Boot + React app:
docker compose -f docker-compose.prod.yml restart wejoinlife-app
```

### Stopping the Stack
```bash
docker compose -f docker-compose.prod.yml down
```

---

## 4. Key Gotchas & Solutions Summary

| Symptom | Cause | Solution |
| :--- | :--- | :--- |
| **`bind: address already in use on 8080`** | Host Tomcat already runs on 8080 | Map Docker Nginx to `8181:80` and keep Spring Boot port `8080` internal (`expose`) |
| **`bind: address already in use on 80 / 443`** | Host Nginx already owns 80/443 | Do not bind Docker Nginx to 80/443; use `8181:80` and let Host Nginx proxy to it |
| **`Failed to load module script (MIME type text/html)`** | Nginx forwarded `/wjl/assets` to `serve`, but `serve` has files at `/assets` | In Docker Nginx, set `proxy_pass http://wejoinlife-app:3000/;` (with trailing slash) |
| **`502 Bad Gateway` on `/wjlapi/`** | Spring Boot failed to connect to database | Check `docker logs wejoinlife-app-prod`; verify `SPRING_DATASOURCE_URL` and MySQL user `172.%` |
| **`Access denied for user 'etn'@'172.x.x.x'`** | User `etn` was only allowed from `192.168.x.x` | In MariaDB run `CREATE USER 'etn'@'172.%' ...` and grant privileges |
