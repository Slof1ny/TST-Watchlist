#!/bin/bash

# Deployment script for Movie Watchlist Frontend
# Deploy to https://huga.tugastst.my.id/

set -e  # Exit on error

echo "🚀 Starting deployment for huga.tugastst.my.id..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="huga.tugastst.my.id"
SSL_PATH="/etc/letsencrypt/live/$DOMAIN"

# Check if running as root for SSL certificate access
if [ "$EUID" -eq 0 ]; then 
    echo -e "${YELLOW}⚠️  Running as root${NC}"
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Check if SSL certificates exist
if [ ! -f "$SSL_PATH/fullchain.pem" ] || [ ! -f "$SSL_PATH/privkey.pem" ]; then
    echo -e "${YELLOW}⚠️  SSL certificates not found at $SSL_PATH${NC}"
    echo -e "${YELLOW}Please run: sudo certbot certonly --standalone -d $DOMAIN${NC}"
    
    read -p "Do you want to continue without SSL? (development only) [y/N]: " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Stop existing container if running
echo "🛑 Stopping existing containers..."
docker-compose down 2>/dev/null || true

# Build new image
echo "🔨 Building Docker image..."
docker-compose build

# Start services
echo "🚀 Starting services..."
docker-compose up -d

# Wait for container to be ready
echo "⏳ Waiting for container to start..."
sleep 3

# Check if container is running
if [ "$(docker ps -q -f name=huga-frontend)" ]; then
    echo -e "${GREEN}✅ Container is running!${NC}"
    
    # Show container status
    docker ps | grep huga-frontend
    
    echo ""
    echo -e "${GREEN}🎉 Deployment successful!${NC}"
    echo ""
    echo "Access your application at:"
    echo -e "${GREEN}  • https://$DOMAIN${NC}"
    echo ""
    echo "View logs:"
    echo "  docker-compose logs -f"
    echo ""
    echo "Stop services:"
    echo "  docker-compose down"
else
    echo -e "${RED}❌ Container failed to start. Checking logs...${NC}"
    docker-compose logs
    exit 1
fi
