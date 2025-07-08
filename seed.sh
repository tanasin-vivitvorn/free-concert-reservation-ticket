#!/bin/bash

# Database Seeding Script
# This script seeds the database with initial data

echo "🌱 Starting database seeding..."

# Check if .env file exists
if [ ! -f "./backend/.env" ]; then
    echo "⚠️  .env file not found. Creating from env.example..."
    cp ./backend/env.example ./backend/.env
fi

# Navigate to backend directory
cd backend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run the seeder
echo "🚀 Running database seeder..."
npm run seed

echo "✅ Seeding completed!" 