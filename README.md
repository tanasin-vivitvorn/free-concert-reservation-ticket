# Free Concert Ticket Booking System

A full-stack web application for booking free concert tickets with user and admin interfaces.

## 🚀 Quick Start

### Prerequisites
- Docker
- Docker Compose
- Git

### Deploy with Docker Compose

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd free-consert-ticket-booking
   ```

2. **Run deployment script**
   ```bash
   ./deploy.sh
   ```

   Or use Docker Compose directly:
   ```bash
   docker-compose up --build -d
   ```

3. **Access the application**
   - Frontend: http://localhost (port 80 via nginx)
   - Backend API: http://localhost/api
   - Database: localhost:5432

## 📁 Project Structure

```
free-consert-ticket-booking/
├── docker-compose.yml          # Main deployment configuration
├── nginx.conf                  # Nginx reverse proxy configuration
├── deploy.sh                   # Deployment script
├── backend/
│   ├── Dockerfile             # Backend container configuration
│   ├── .dockerignore          # Files to exclude from build
│   ├── env.example            # Backend environment variables
│   └── src/                   # NestJS source code
├── frontend/
│   ├── Dockerfile             # Frontend container configuration
│   ├── .dockerignore          # Files to exclude from build
│   ├── env.example            # Frontend environment variables
│   └── src/                   # Next.js source code
└── README.md                  # This file
```

## 🔧 Services

### 1. PostgreSQL Database
- **Port**: 5432
- **Database**: concert_booking
- **Username**: postgres
- **Password**: password
- **Volume**: postgres_data (persistent data)

### 2. Backend API (NestJS)
- **Internal Port**: 3000
- **External Access**: http://localhost/api
- **Environment**: Production
- **Dependencies**: PostgreSQL
- **Features**: 
  - RESTful API
  - JWT Authentication
  - TypeORM with PostgreSQL
  - Swagger Documentation

### 3. Frontend (Next.js)
- **Internal Port**: 8080
- **External Access**: http://localhost (port 80)
- **Environment**: Production
- **Dependencies**: Backend API
- **Features**:
  - React with TypeScript
  - Tailwind CSS
  - Admin Dashboard
  - User Interface

### 4. Nginx Reverse Proxy
- **Port**: 80
- **Features**:
  - Reverse proxy for frontend and backend
  - Load balancing
  - Rate limiting
  - Gzip compression
  - Security headers
  - CORS handling
  - Static file caching

## 🔒 Environment Variables Configuration

This project separates environment variables into 2 parts: **Backend** and **Frontend**

### Quick Setup

#### 1. Backend Setup
```bash
cd backend
cp env.example .env
```

#### 2. Frontend Setup
```bash
cd frontend
cp env.example .env
```

#### 3. Run System
```bash
docker-compose up --build
```

### Main Environment Variables

#### Backend (`backend/env.example`)
```env
# Database
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=concertdb

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# App
PORT=3000
NODE_ENV=development
```

#### Frontend (`frontend/env.example`)
```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3000

# App
PORT=8080
NODE_ENV=development
```

### Docker Usage

Docker Compose will load environment variables from `env.example` files:

```yaml
# Backend
env_file:
  - ./backend/env.example

# Frontend
env_file:
  - ./frontend/env.example
```

### Security Notes

⚠️ **Important**: 
- Change `JWT_SECRET` value in production
- Do not commit `.env` files to Git repository
- Use `env.example` files as templates only

## 🛠️ Useful Commands

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f nginx
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Stop services
```bash
docker-compose down
```

### Restart services
```bash
docker-compose restart
```

### Update and redeploy
```bash
docker-compose down
docker-compose up --build -d
```

### Access database
```bash
docker-compose exec postgres psql -U postgres -d concert_booking
```

### Access backend container
```bash
docker-compose exec backend sh
```

### Access frontend container
```bash
docker-compose exec frontend sh
```

### Access nginx container
```bash
docker-compose exec nginx sh
```

## 🌐 Nginx Configuration Features

### Security
- Rate limiting (API: 10 req/s, Frontend: 30 req/s)
- Security headers (XSS protection, CSRF, etc.)
- CORS handling for API requests

### Performance
- Gzip compression
- Static file caching (1 year for assets)
- Connection pooling
- Timeout configuration

### Routing
- Frontend: `/` → Next.js app
- Backend: `/api/*` → NestJS API
- Health check: `/health`

## 📊 Monitoring

### Check service status
```bash
docker-compose ps
```

### Check resource usage
```bash
docker stats
```

### Health check
```bash
curl http://localhost/health
```

### View nginx access logs
```bash
docker-compose exec nginx tail -f /var/log/nginx/access.log
```

## 🧪 Testing

```bash
# Run entire system
docker-compose up --build

# Run backend only
docker-compose up backend

# Run frontend only
docker-compose up frontend

# Development mode
cd backend && npm run start:dev
cd frontend && npm run dev
```

## 🐛 Troubleshooting

### Common Issues

1. **Port 80 already in use**
   ```bash
   # Check what's using port 80
   sudo lsof -i :80
   
   # Stop conflicting services (e.g., Apache, nginx)
   sudo systemctl stop apache2
   sudo systemctl stop nginx
   ```

2. **Nginx configuration errors**
   ```bash
   # Check nginx config
   docker-compose exec nginx nginx -t
   
   # View nginx error logs
   docker-compose logs nginx
   ```

3. **API connection issues**
   ```bash
   # Test API endpoint
   curl http://localhost/api/health
   
   # Check backend logs
   docker-compose logs backend
   ```

4. **Frontend not loading**
   ```bash
   # Check frontend logs
   docker-compose logs frontend
   
   # Test frontend directly
   curl http://localhost
   ```

## 🔄 Production Deployment

For production deployment, consider:

1. **SSL/TLS**: Add SSL certificates and HTTPS
2. **Domain**: Configure custom domain names
3. **Monitoring**: Add health checks and monitoring tools
4. **Backup**: Set up database backup strategy
5. **Scaling**: Use Docker Swarm or Kubernetes for scaling
6. **Security**: Use proper secrets management

### SSL Configuration Example
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /etc/ssl/certs/yourdomain.crt;
    ssl_certificate_key /etc/ssl/private/yourdomain.key;
    
    # ... rest of configuration
}
```

## 📖 Additional Guides

- **Backend**: See `backend/README.md`
- **Frontend**: See `frontend/README.md`

## 📝 Notes

- Frontend is served on port 80 via nginx reverse proxy
- Backend API is accessible at `/api/*` endpoints
- All services are connected via Docker network
- Data is persisted in Docker volumes
- Production builds are optimized for performance 