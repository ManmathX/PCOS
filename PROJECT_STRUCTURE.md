# PCOS App - Project Structure

This PCOS Early-Detection & Guidance App is split into two independent projects:

## 📁 Project Structure

```
.
├── pcos-frontend/          # React + Vite frontend application
└── pcos-backend/           # Node.js + Express + Prisma backend
```

## 🚀 Quick Start

### Option 1: Run from Existing Structure

The app is currently in a monorepo structure with backend in `server/` folder.

**Start Backend:**
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET
npx prisma db push
npx prisma db seed
npm run dev
```

**Start Frontend (in new terminal):**
```bash
npm install
npm run dev
```

### Option 2: Separate Projects (Recommended for Production)

**To create truly separate projects:**

1. **Move Backend:**
```bash
# Copy server folder to pcos-backend
cp -r server/* pcos-backend/
cd pcos-backend
npm install
```

2. **Move Frontend:**
```bash
# Copy frontend files to pcos-frontend
cp -r src pcos-frontend/
cp -r public pcos-frontend/
cp package.json pcos-frontend/
cp vite.config.js pcos-frontend/
cp tailwind.config.js pcos-frontend/
cp postcss.config.js pcos-frontend/
cp index.html pcos-frontend/
cp .env pcos-frontend/

cd pcos-frontend
npm install
```

3. **Update Frontend .env:**
```env
# pcos-frontend/.env
VITE_API_URL=http://localhost:5000/api
```

4. **Run Independently:**

Terminal 1 (Backend):
```bash
cd pcos-backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd pcos-frontend
npm run dev
```

## 📦 What Each Project Contains

### Frontend (pcos-frontend/)
- React 19 with Vite
- Tailwind CSS custom theme
- React Router for navigation
- React Query for API state
- Recharts for data visualization
- jsPDF for PDF generation
- Complete UI components
- User & Doctor dashboards

### Backend (pcos-backend/)
- Node.js + Express server
- Prisma ORM with PostgreSQL
- JWT authentication
- Role-based access control
- Risk scoring engine
- Cycle prediction algorithm
- RESTful API endpoints
- Database migrations

## 🔧 Configuration Files

### Frontend Config Files
- `package.json` - Dependencies & scripts
- `vite.config.js` - Vite configuration
- `tailwind.config.js` - Custom PCOS theme
- `postcss.config.js` - PostCSS setup
- `.env` - API URL configuration

### Backend Config Files
- `package.json` - Dependencies & scripts
- `prisma/schema.prisma` - Database schema
- `.env` - Database & JWT configuration
- `src/index.js` - Server entry point

## 🌐 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Push `pcos-frontend/` to Git repository
2. Connect to Vercel/Netlify
3. Set environment variable: `VITE_API_URL=https://your-backend-url.com/api`
4. Deploy

### Backend Deployment (Railway/Render)
1. Push `pcos-backend/` to Git repository
2. Connect to Railway/Render
3. Set environment variables (DATABASE_URL, JWT_SECRET, etc.)
4. Deploy

## 📚 Documentation

- **Quick Start**: See `QUICKSTART.md`
- **Full README**: See `README.md`
- **API Documentation**: See backend README

## 🔗 Current Structure (Monorepo)

If you prefer to keep the monorepo structure:
```
untitled folder 12/
├── src/              # Frontend source
├── server/           # Backend source
├── public/           # Frontend public assets
├── package.json      # Frontend dependencies
└── server/package.json  # Backend dependencies
```

Both structures are valid. Choose based on your deployment needs:
- **Monorepo**: Easier local development, single repo
- **Separate**: Better for independent deployment, scaling, teams

---

**Current Status:** App is fully functional in monorepo structure. Both approaches work!
