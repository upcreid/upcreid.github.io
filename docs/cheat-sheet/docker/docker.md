# Docker - Complete Cheat Sheet

Docker is a containerization platform that allows you to package, distribute, and run applications in isolated environments called containers.

## Installation

### Linux (Ubuntu/Debian)
```bash
# Uninstall old versions
sudo apt-get remove docker docker-engine docker.io containerd runc

# Install dependencies
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up the repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

### macOS
```bash
# Via Homebrew
brew install --cask docker

# Or download Docker Desktop
# https://www.docker.com/products/docker-desktop/
```

### Windows
```powershell
# Via Chocolatey
choco install docker-desktop

# Or download Docker Desktop
# https://www.docker.com/products/docker-desktop/
```

### Post-installation Linux
```bash
# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker run hello-world
```

## Basic Commands

### Information and Help
```bash
# Docker version
docker --version
docker version

# System information
docker info
docker system info

# Help on a command
docker COMMAND --help
docker run --help
```

## Image Management

### Search and Download
```bash
# Search for an image
docker search nginx
docker search --filter stars=100 nginx

# Download an image
docker pull nginx
docker pull nginx:1.25
docker pull nginx:alpine

# Download from a private registry
docker pull registry.example.com/nginx:latest
```

### List and Inspect
```bash
# List images
docker images
docker image ls
docker image ls -a

# Filter images
docker images --filter "dangling=true"
docker images --filter "reference=nginx:*"

# Display image details
docker image inspect nginx
docker image inspect nginx:alpine --format '{{.Architecture}}'

# Image history
docker history nginx
```

### Create and Manage
```bash
# Build an image from a Dockerfile
docker build -t mon-app:1.0 .
docker build -t mon-app:latest -f Dockerfile.prod .
docker build --no-cache -t mon-app:1.0 .

# Tag an image
docker tag mon-app:1.0 mon-app:latest
docker tag mon-app:1.0 registry.example.com/mon-app:1.0

# Save/Load an image
docker save mon-app:1.0 -o mon-app.tar
docker load -i mon-app.tar

# Export/Import from a container
docker export mon-conteneur -o mon-conteneur.tar
docker import mon-conteneur.tar mon-app:imported

# Remove images
docker rmi nginx
docker rmi $(docker images -q -f "dangling=true")
docker image prune
docker image prune -a
```

### Publish Images
```bash
# Log in to Docker Hub
docker login
docker login registry.example.com

# Push an image
docker push mon-app:1.0
docker push registry.example.com/mon-app:1.0

# Log out
docker logout
```

## Container Management

### Running Containers
```bash
# Run a simple container
docker run nginx
docker run -d nginx                    # Detached mode
docker run -it ubuntu /bin/bash        # Interactive mode

# Name a container
docker run --name mon-nginx -d nginx

# Port mapping
docker run -p 8080:80 nginx            # Host:Container
docker run -p 127.0.0.1:8080:80 nginx  # Specify interface
docker run -P nginx                    # All exposed ports

# Environment variables
docker run -e "MYSQL_ROOT_PASSWORD=secret" mysql
docker run --env-file .env mon-app

# Resource limits
docker run -m 512m nginx               # Max memory
docker run --cpus=".5" nginx           # 50% of one CPU
docker run --memory=512m --cpus=1 nginx

# Volumes and mounts
docker run -v /host/path:/container/path nginx
docker run -v mon-volume:/data nginx
docker run --mount type=bind,source=/host/path,target=/container/path nginx
docker run --mount type=volume,source=mon-volume,target=/data nginx

# Network
docker run --network mon-reseau nginx
docker run --network host nginx

# Automatic restart
docker run --restart unless-stopped nginx
docker run --restart on-failure:3 nginx

# Automatically remove after stop
docker run --rm busybox echo "Hello"

# Specific user
docker run -u 1000:1000 nginx
docker run --user $(id -u):$(id -g) nginx
```

### Lifecycle Management
```bash
# List containers
docker ps                              # Active containers
docker ps -a                           # All containers
docker ps -a --filter "status=exited"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Start/Stop
docker start mon-conteneur
docker stop mon-conteneur
docker restart mon-conteneur
docker pause mon-conteneur
docker unpause mon-conteneur

# Kill a container
docker kill mon-conteneur
docker kill --signal=HUP mon-conteneur

# Remove containers
docker rm mon-conteneur
docker rm -f mon-conteneur             # Force removal
docker rm $(docker ps -a -q)           # All containers
docker container prune                 # Stopped containers
docker container prune --filter "until=24h"
```

### Inspection and Logs
```bash
# Inspect a container
docker inspect mon-conteneur
docker inspect mon-conteneur --format '{{.State.Status}}'
docker inspect mon-conteneur --format '{{.NetworkSettings.IPAddress}}'

# View logs
docker logs mon-conteneur
docker logs -f mon-conteneur           # Follow in real-time
docker logs --tail 100 mon-conteneur   # Last 100 lines
docker logs --since 10m mon-conteneur  # Since 10 minutes ago
docker logs --timestamps mon-conteneur

# Real-time statistics
docker stats
docker stats mon-conteneur
docker stats --no-stream               # Snapshot

# Processes in the container
docker top mon-conteneur
docker top mon-conteneur aux

# Docker events
docker events
docker events --filter "container=mon-conteneur"
docker events --since '2024-01-01'
```

### Interaction with Containers
```bash
# Execute a command in a container
docker exec mon-conteneur ls /app
docker exec -it mon-conteneur /bin/bash
docker exec -it mon-conteneur sh
docker exec -u root -it mon-conteneur bash

# Copy files
docker cp mon-conteneur:/app/file.txt ./file.txt
docker cp ./file.txt mon-conteneur:/app/file.txt
docker cp ./config/ mon-conteneur:/etc/app/

# Attach to container
docker attach mon-conteneur

# Update configuration
docker update --memory 1g mon-conteneur
docker update --restart unless-stopped mon-conteneur

# Rename a container
docker rename ancien-nom nouveau-nom

# View filesystem changes
docker diff mon-conteneur

# Create an image from a container
docker commit mon-conteneur mon-nouvelle-image:1.0
```

## Volume Management

### Creation and Management
```bash
# Create a volume
docker volume create mon-volume
docker volume create --driver local mon-volume

# List volumes
docker volume ls
docker volume ls --filter "dangling=true"

# Inspect a volume
docker volume inspect mon-volume

# Remove volumes
docker volume rm mon-volume
docker volume prune
docker volume prune --filter "label!=keep"

# Use volumes
docker run -v mon-volume:/data nginx
docker run --mount source=mon-volume,target=/data nginx
```

### Named vs Anonymous Volumes
```bash
# Named volume (persistent)
docker run -v mon-volume:/data nginx

# Anonymous volume (automatically generated)
docker run -v /data nginx

# Bind mount (bind a host directory)
docker run -v /host/path:/container/path nginx
docker run -v $(pwd):/app mon-app

# Read-only volume
docker run -v mon-volume:/data:ro nginx
docker run -v /host/path:/container/path:ro nginx
```

## Network Management

### Creation and Configuration
```bash
# List networks
docker network ls

# Create a network
docker network create mon-reseau
docker network create --driver bridge mon-reseau
docker network create --subnet=192.168.1.0/24 mon-reseau

# Inspect a network
docker network inspect mon-reseau
docker network inspect bridge

# Connect/Disconnect a container
docker network connect mon-reseau mon-conteneur
docker network disconnect mon-reseau mon-conteneur

# Remove networks
docker network rm mon-reseau
docker network prune
```

### Network Types
```bash
# Bridge (default)
docker run --network bridge nginx

# Host (use host's network)
docker run --network host nginx

# None (no network)
docker run --network none nginx

# Custom network with DNS
docker network create --driver bridge app-network
docker run --network app-network --name db postgres
docker run --network app-network --name web nginx
# 'web' can access 'db' via the hostname 'db'
```

## Docker Compose

### docker-compose.yml File
```yaml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    image: mon-app:latest
    container_name: web-app
    ports:
      - "8080:80"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://db:5432/mydb
    env_file:
      - .env
    volumes:
      - ./app:/usr/src/app
      - node_modules:/usr/src/app/node_modules
    networks:
      - app-network
    depends_on:
      - db
      - redis
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M

  db:
    image: postgres:15-alpine
    container_name: postgres-db
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - app-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: redis-cache
    command: redis-server --appendonly yes
    volumes:
      - redis-data:/data
    networks:
      - app-network
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    container_name: nginx-proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    networks:
      - app-network
    depends_on:
      - web
    restart: unless-stopped

volumes:
  postgres-data:
  redis-data:
  node_modules:

networks:
  app-network:
    driver: bridge
```

### Docker Compose Commands
```bash
# Start services
docker compose up
docker compose up -d                   # Detached mode
docker compose up --build              # Rebuild images
docker compose up --force-recreate     # Recreate containers

# Stop services
docker compose down
docker compose down -v                 # Remove volumes too
docker compose down --rmi all          # Remove images too

# Manage services
docker compose start
docker compose stop
docker compose restart
docker compose pause
docker compose unpause

# List services
docker compose ps
docker compose ps -a

# View logs
docker compose logs
docker compose logs -f                 # Follow
docker compose logs -f web             # Specific service
docker compose logs --tail=100 web

# Execute a command
docker compose exec web sh
docker compose exec db psql -U user mydb

# Build images
docker compose build
docker compose build --no-cache
docker compose build web

# Scale services
docker compose up -d --scale web=3

# Validate configuration
docker compose config
docker compose config --quiet

# View events
docker compose events
docker compose events --json

# Pull images
docker compose pull

# Create containers without starting them
docker compose create
```

## Dockerfile - Best Practices

### Basic Structure
```dockerfile
# Base image
FROM node:18-alpine AS base

# Metadata
LABEL maintainer="admin@example.com"
LABEL version="1.0"
LABEL description="Node.js Application"

# Environment variables
ENV NODE_ENV=production \
    PORT=3000 \
    APP_HOME=/usr/src/app

# Working directory
WORKDIR ${APP_HOME}

# Non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy source code
COPY --chown=nodejs:nodejs . .

# Expose port
EXPOSE ${PORT}

# Switch to non-root user
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD node healthcheck.js

# Default command
CMD ["node", "server.js"]
```

### Multi-Stage Build
```dockerfile
# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build && \
    npm prune --production

# Stage 2: Production
FROM node:18-alpine AS production

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs package*.json ./

USER nodejs

EXPOSE 3000

CMD ["node", "dist/server.js"]

# Stage 3: Development
FROM node:18 AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

USER node

EXPOSE 3000 9229

CMD ["npm", "run", "dev"]
```

### Layer Optimization
```dockerfile
# ❌ Bad - Creates multiple layers
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y git
RUN apt-get clean

# ✅ Good - Single layer
RUN apt-get update && \
    apt-get install -y \
        curl \
        git \
    && apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# ❌ Bad - COPY invalidates cache on every change
COPY . .
RUN npm install

# ✅ Good - Uses Docker cache efficiently
COPY package*.json ./
RUN npm install
COPY . .
```

## Docker System Commands

### Cleanup and Maintenance
```bash
# View disk usage
docker system df
docker system df -v

# Clean up all unused resources
docker system prune
docker system prune -a                 # Unused images too
docker system prune -a --volumes       # Volumes too
docker system prune --filter "until=24h"

# System events
docker system events
docker system events --since '1h'
docker system events --filter 'type=container'
```

### Registry and Images
```bash
# Log in to a registry
docker login
docker login registry.example.com
docker login -u username -p password registry.example.com

# Push/Pull from a private registry
docker tag mon-app:1.0 registry.example.com/mon-app:1.0
docker push registry.example.com/mon-app:1.0
docker pull registry.example.com/mon-app:1.0

# Start a local registry
docker run -d -p 5000:5000 --name registry registry:2
docker tag mon-app:1.0 localhost:5000/mon-app:1.0
docker push localhost:5000/mon-app:1.0
```

## Security

### Best Practices
```bash
# Analyze an image with Docker Scout
docker scout cves nginx:latest
docker scout quickview nginx:latest

# Don't use root
# In the Dockerfile
RUN adduser -D appuser
USER appuser

# Limit capabilities
docker run --cap-drop ALL --cap-add NET_BIND_SERVICE nginx

# Read-only mode
docker run --read-only --tmpfs /tmp nginx

# Limit resources
docker run -m 512m --cpus="0.5" --pids-limit 100 nginx

# Secrets (with Docker Swarm or Compose)
echo "my_secret_password" | docker secret create db_password -
docker service create --secret db_password postgres
```

### Vulnerability Scanning
```bash
# With Trivy
trivy image nginx:latest
trivy image --severity HIGH,CRITICAL mon-app:1.0

# With Snyk
snyk container test nginx:latest
```

## Kubernetes (k9s & kubectl)

### K9s - TUI Interface for Kubernetes
```bash
# Launch K9s
k9s

# Main commands
:pod         # View pods
:deploy      # View deployments
:svc         # View services
:ns          # Change namespace

# Keyboard shortcuts
d            # Describe resource
l            # View logs
s            # Shell into pod
Ctrl+d       # Delete
?            # Help
```

### Kubectl - Kubernetes CLI
```bash
# Configuration
kubectl config view
kubectl config get-contexts
kubectl config use-context mon-contexte
kubectl config set-context --current --namespace=mon-namespace

# Pods
kubectl get pods
kubectl get pods -o wide
kubectl describe pod mon-pod
kubectl logs mon-pod
kubectl logs -f mon-pod
kubectl exec -it mon-pod -- /bin/bash

# Deployments
kubectl get deployments
kubectl create deployment nginx --image=nginx:1.25
kubectl scale deployment nginx --replicas=3
kubectl rollout status deployment/nginx
kubectl rollout undo deployment/nginx

# Services
kubectl get services
kubectl expose deployment nginx --port=80 --target-port=80
kubectl port-forward service/nginx 8080:80

# Apply manifests
kubectl apply -f deployment.yaml
kubectl apply -f ./manifests/
kubectl delete -f deployment.yaml

# Debugging
kubectl describe pod mon-pod
kubectl get events
kubectl top pods
kubectl top nodes
```

## Complete Practical Examples

### Web Application with Database
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    volumes:
      - ./app:/usr/src/app
    networks:
      - app-network

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_PASSWORD: password
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - app-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - app
    networks:
      - app-network

volumes:
  postgres-data:

networks:
  app-network:
    driver: bridge
```

### Monitoring Application
```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
    networks:
      - monitoring

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana
    depends_on:
      - prometheus
    networks:
      - monitoring

  node-exporter:
    image: prom/node-exporter:latest
    ports:
      - "9100:9100"
    networks:
      - monitoring

volumes:
  prometheus-data:
  grafana-data:

networks:
  monitoring:
    driver: bridge
```

## Troubleshooting

### Common Issues
```bash
# Container won't start
docker logs mon-conteneur
docker inspect mon-conteneur
docker events --filter container=mon-conteneur

# Network issues
docker network inspect bridge
docker exec mon-conteneur ping autre-conteneur
docker exec mon-conteneur nslookup autre-conteneur

# Permission issues
docker exec -u root mon-conteneur chown -R appuser:appuser /data

# Disk space
docker system df
docker system prune -a
docker volume prune

# Performance
docker stats
docker top mon-conteneur
docker inspect --format='{{.State.Pid}}' mon-conteneur
htop -p $(docker inspect --format='{{.State.Pid}}' mon-conteneur)
```

## Resources

- **Official Documentation**: https://docs.docker.com/
- **Docker Hub**: https://hub.docker.com/
- **Docker Compose**: https://docs.docker.com/compose/
- **Dockerfile Best Practices**: https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
- **Docker Security**: https://docs.docker.com/engine/security/
- **Kubernetes**: https://kubernetes.io/docs/

---

*This Docker guide covers essential and advanced commands for efficiently managing your containers, images, volumes, and networks. Mastering these commands will make you more productive in your deployments and containerized application management.*
