# PCOS Early-Detection & Guidance App - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database

### Installation & Setup

1. **Install Frontend Dependencies**
```bash
npm install
```

2. **Install Backend Dependencies**
```bash
cd server
npm install
```

3. **Configure Environment Variables**

Backend (`server/.env`):
```env
DATABASE_URL="postgresql://username:password@localhost:5432/pcos_app"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
```

Frontend (`.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

4. **Initialize Database**
```bash
cd server
npx prisma db push
npx prisma db seed  # Seeds challenges
```

5. **Run the Application**

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
npm run dev
```

6. **Access the App**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🎯 What's Included

### ✅ Fully Functional Features
- **Cycle Tracking** - Log cycles with flow, pain, medications
- **Symptom Logging** - 12 symptom types with severity tracking
- **Risk Assessment** - Explainable PCOS risk scoring
- **Cycle Predictions** - Next period prediction with confidence
- **Habits & Streaks** - 4 PCOS-friendly habits with streak counters
- **Challenges** - 5 wellness challenges (7-14 days)
- **Appointment Prep** - PDF export with cycle/symptom history
- **Myth Busters** - Educational content debunking PCOS myths
- **Doctor Dashboard** - Patient management with consent system

### 📝 Key Features
- Dual-role authentication (User/Doctor)
- Medical disclaimers throughout
- Responsive design (mobile + desktop)
- Data visualization with Recharts
- JWT authentication + RBAC
- PostgreSQL with Prisma ORM

## 🔧 Database Commands

```bash
# View database in Prisma Studio
cd server
npm run db:studio

# Reset and reseed database
npx prisma db push --force-reset
npx prisma db seed

# Generate Prisma client
npx prisma generate
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register (USER or DOCTOR)
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get user profile

### User Endpoints (Protected)
- `GET/POST /api/cycles` - Cycle CRUD
- `GET/POST /api/symptoms` - Symptom logging
- `GET /api/risk/calculate` - Calculate risk
- `GET /api/predictions/next-cycle` - Predict next period
- `GET/POST /api/habits` - Habit tracking
- `GET /api/habits/streaks` - Get streaks
- `GET/POST /api/challenges` - Challenges

### Doctor Endpoints (Protected)
- `GET /api/doctor/patients` - List consented patients
- `GET /api/doctor/patients/:id` - Patient details
- `POST /api/doctor/patients/:id/comment` - Add comment

## 🎨 User Flows

### New User Flow
1. Register → Select "User" role
2. Log first cycle entry
3. Log symptoms
4. View risk assessment (2+ cycles needed)
5. Start daily habits
6. Join a challenge
7. Generate appointment prep PDF

### Doctor Flow
1. Register → Select "Doctor" role + credentials
2. Wait for patient consent grants
3. View patient list
4. Review patient data (cycles, symptoms, risk)
5. Add clinical comments
6. Monitor high-risk patients

## 💡 Tips

### For Testing
- Create multiple cycles to see predictions
- Log varied symptoms to see risk scoring
- Complete habits daily to build streaks
- Generate PDF after logging data

### For Production
- Use strong JWT_SECRET
- Set up PostgreSQL on cloud (Supabase, Railway)
- Configure CORS for production domain
- Set NODE_ENV=production
- Enable HTTPS

## 📚 Documentation
- Full docs: `README.md`
- Walkthrough: See artifacts folder
- Task list: See artifacts folder

## 🆘 Troubleshooting

**Frontend won't connect to backend:**
- Check VITE_API_URL in `.env`
- Ensure backend is running on port 5000

**Database connection error:**
- Verify DATABASE_URL in `server/.env`
- Ensure PostgreSQL is running
- Run `npx prisma db push`

**Import errors:**
- Run `npm install` in both root and server
- Check Node.js version (18+)

---

**🎉 You're all set! Start tracking your PCOS wellness journey.**
