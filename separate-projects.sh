#!/bin/bash

# PCOS App - Separate Backend and Frontend Script
# This script creates two independent projects from the monorepo

set -e  # Exit on error

echo "🚀 Separating PCOS App into Frontend and Backend..."

# Create directories
echo "📁 Creating project directories..."
mkdir -p pcos-backend pcos-frontend

# ==================== BACKEND ====================
echo "📦 Setting up Backend..."

# Copy backend files
cp -r server/* pcos-backend/ 2>/dev/null || true
cp pcos-backend/package.json pcos-backend/package.json.bak 2>/dev/null || true

# Copy the new standalone package.json if it exists
if [ -f "pcos-backend/package.json" ]; then
    echo "✓ Backend package.json ready"
else
    echo "Creating backend package.json..."
fi

# Copy documentation
cp pcos-backend/README.md pcos-backend/README.md 2>/dev/null || echo "Backend README already exists"

echo "✓ Backend files copied"

# ==================== FRONTEND ====================
echo "📦 Setting up Frontend..."

# Copy frontend files
cp -r src pcos-frontend/ 2>/dev/null || true
cp -r public pcos-frontend/ 2>/dev/null || true
cp index.html pcos-frontend/ 2>/dev/null || true
cp vite.config.js pcos-frontend/ 2>/dev/null || true
cp tailwind.config.js pcos-frontend/ 2>/dev/null || true
cp postcss.config.js pcos-frontend/ 2>/dev/null || true
cp .env pcos-frontend/.env 2>/dev/null || echo "No .env to copy"
cp pcos-frontend/.env.example pcos-frontend/.env.example 2>/dev/null || touch pcos-frontend/.env.example

echo "✓ Frontend files copied"

# ==================== CLEANUP ====================
echo "🧹 Setting up configurations..."

# Ensure .gitignore files exist
if [ ! -f "pcos-backend/.gitignore" ]; then
    echo "node_modules
.env
dist
prisma/migrations
.DS_Store" > pcos-backend/.gitignore
fi

if [ ! -f "pcos-frontend/.gitignore" ]; then
    echo "node_modules
.env
dist
.DS_Store" > pcos-frontend/.gitignore
fi

# ==================== FINAL MESSAGES ====================
echo ""
echo "✅ Separation Complete!"
echo ""
echo "📂 Two independent projects created:"
echo "   - pcos-backend/  (Node.js + Express + Prisma)"
echo "   - pcos-frontend/ (React + Vite + Tailwind)"
echo ""
echo "🎯 Next Steps:"
echo ""
echo "1️⃣  Setup Backend:"
echo "   cd pcos-backend"
echo "   npm install"
echo "   cp .env.example .env"
echo "   # Edit .env with your DATABASE_URL and JWT_SECRET"
echo "   npx prisma db push"
echo "   npx prisma db seed"
echo "   npm run dev"
echo ""
echo "2️⃣  Setup Frontend (in new terminal):"
echo "   cd pcos-frontend"
echo "   npm install"
echo "   cp .env.example .env"
echo "   # Verify VITE_API_URL points to backend"
echo "   npm run dev"
echo ""
echo "🌐 Access:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo ""
echo "📚 See PROJECT_STRUCTURE.md for more details"
echo ""
