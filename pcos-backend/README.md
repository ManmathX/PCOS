# PCOS Backend API

Backend server for PCOS Early-Detection & Guidance App.

## Tech Stack
- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT Authentication
- RBAC (Role-Based Access Control)

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your configuration
npx prisma db push
npx prisma db seed
npm run dev
```

## Environment Variables

Create `.env` file:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/pcos_app"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register (USER or DOCTOR)
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get user profile

### User Endpoints
- `GET/POST /api/cycles` - Cycle tracking
- `GET/POST /api/symptoms` - Symptom logging
- `GET /api/risk/calculate` - Calculate PCOS risk
- `GET /api/predictions/next-cycle` - Predict next period
- `GET/POST /api/habits` - Habit tracking
- `GET /api/challenges` - Wellness challenges

### Doctor Endpoints
- `GET /api/doctor/patients` - List patients
- `GET /api/doctor/patients/:id` - Patient details
- `POST /api/doctor/patients/:id/comment` - Add comment

## Scripts

```bash
npm run dev       # Start dev server with watch mode
npm start         # Start production server
npm run db:push   # Push schema to database
npm run db:studio # Open Prisma Studio
npm run db:seed   # Seed challenges
```

## Deployment

Deploy to Railway, Render, or AWS:
1. Set environment variables
2. Connect PostgreSQL database
3. Run `npx prisma db push`
4. Start with `npm start`
