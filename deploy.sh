#!/bin/bash

echo "🚀 Starting Concert Ticket Booking System Deployment..."

# Stop existing containers
echo "📦 Stopping existing containers..."
docker-compose down

# Remove old images
echo "🧹 Cleaning up old images..."
docker system prune -f

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 15

# Check service status
echo "📊 Checking service status..."
docker-compose ps

echo "✅ Deployment completed!"
echo ""
echo "🌐 Services available at:"
echo "   Frontend: http://localhost (port 80 via nginx)"
echo "   Backend API: http://localhost/api"
echo "   Database: localhost:5432"
echo ""
echo "📝 Useful commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart services: docker-compose restart"
echo "   Check nginx logs: docker-compose logs nginx" 