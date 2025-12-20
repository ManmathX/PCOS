# PCOS Early-Detection & Guidance App

> ⚕️ **Medical Disclaimer**: This app does not diagnose. It supports early awareness and doctor consultation.

A production-ready React application for PCOS risk detection with dual roles (User & Doctor), explainable AI-assisted guidance, and comprehensive health tracking.

## ✨ Features

### User Features
- 🔐 **Dual Authentication**: Email/password + OTP login support
- 📅 **Smart Cycle Tracking**: Predict next period with high accuracy
- 🎯 **Explainable Risk Detection**: Transparent PCOS risk scoring with clear reasons
- 📊 **Symptom Logging**: Adaptive symptom tracking with intelligent follow-ups
- 🏆 **Gamification**: Habit streaks, challenges, and progress tracking
- 📄 **Appointment Prep**: Auto-generated PDF summaries for doctor visits
- 📱 **Responsive Design**: Beautiful UI optimized for all devices

### Doctor Features
- 👥 **Patient Management**: View consented patients and their data
- 📈 **Risk Monitoring**: Filter high-risk patients needing attention
- 💬 **Comments & Guidance**: Add professional recommendations
- 🔒 **Consent-Based Access**: Only approved patient data is visible

## 🎨 Design Theme

- **Soft Pink** (#FFB6C1, #FFC0CB) - Primary actions and highlights
- **Warm Beige** (#F5E6D3, #E8D5C4) - Background and cards
- **Sage Green** (#9CAF88, #87A96B) - Secondary actions and accents

## 🏗️ Tech Stack

### Frontend
- **React** 19.2 with **Vite** 7.2
- **React Router** 7.11 for routing
- **TanStack React Query** 5.90 for server state
- **Tailwind CSS** 4.1 for styling
- **Recharts** 3.6 for data visualization
- **Axios** for API calls
- **Lucide React** for icons
- **jsPDF** for PDF generation

### Backend
- **Node.js** with **Express** 4.18
- **Prisma ORM** 5.20 with PostgreSQL
- **JWT** authentication
- **bcryptjs** for password hashing
- **CORS** and rate limiting
- **Nodemailer** for OTP (future)

## 📁 Project Structure

```
pcos-app/
├── server/                     # Backend
│   ├── src/
│   │   ├── routes/            # API endpoints
│   │   │   └── auth.js        # Authentication routes
│   │   ├── services/          # Business logic
│   │   │   ├── riskEngine.js   # PCOS risk scoring
│   │   │   └── predictionEngine.js  # Cycle prediction
│   │   ├── middleware/        # Auth & RBAC
│   │   │   ├── auth.js
│   │   │   └── rbac.js
│   │   └── index.js           # Server entry point
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── package.json
│   └── .env.example
│
├── src/                        # Frontend
│   ├── components/
│   │   └── auth/
│   │       ├── LoginForm.jsx
│   │       ├── RegisterForm.jsx
│   │       └── ProtectedRoute.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx    # Auth state management
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── user/
│   │   │   └── Dashboard.jsx  # User dashboard
│   │   └── doctor/
│   │       └── DashboardDoctor.jsx  # Doctor dashboard
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # Entry point
│   └── index.css              # Tailwind setup
│
├── tailwind.config.js          # Tailwind theme config
├── postcss.config.js
├── vite.config.js
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and **npm**
- **PostgreSQL** database

### Installation

1. **Clone the repository** (or navigate to the project directory)

```bash
cd "untitled folder 12"
```

2. **Install frontend dependencies**

```bash
npm install
```

3. **Install backend dependencies**

```bash
cd server
npm install
```

4. **Set up environment variables**

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

5. **Initialize the database**

```bash
cd server
npx prisma db push
```

### Running the Application

**Start the backend server:**
```bash
cd server
npm run dev
```

Server runs on `http://localhost:5000`

**Start the frontend dev server** (in a new terminal):
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

### Database Management

```bash
# View database in Prisma Studio
cd server
npm run db:studio

# Create a migration
npm run db:migrate

# Push schema changes without migration
npm run db:push
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (USER or DOCTOR)
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/me` - Get current user profile (protected)
- `POST /api/auth/otp/send` - Send OTP (placeholder)
- `POST /api/auth/otp/verify` - Verify OTP (placeholder)

### Health Check
- `GET /` - API info
- `GET /health` - Database connection status

## 🎯 Risk Scoring Engine

The PCOS risk engine uses rule-based scoring (ML-ready architecture):

### Factors (out of 100 points)
- **Cycle Irregularity** (30 pts): >45 days = high risk
- **BMI Trends** (20 pts): Increasing BMI >25
- **Symptom Clustering** (25 pts): Acne + hair loss + mood
- **Pain Spikes** (15 pts): Sudden pain increase
- **Family History** (10 pts): Diabetes

### Risk Levels
- **LOW**: Score < 30
- **MODERATE**: Score 30-59
- **HIGH**: Score ≥ 60

### Explainability
Every risk score includes transparent reasons:
- ✅ "Cycle >45 days (irregular)"
- ✅ "BMI increasing trend (>25)"
- ✅ "Acne + hair loss (hormonal indicators)"

## 📊 Cycle Prediction

The prediction engine analyzes the last 3-6 cycles to:
- Calculate average cycle length
- Measure pattern regularity (std deviation)
- Predict next period date
- Calculate PMS window (2-3 days before)
- Assign confidence level (high/medium/low)

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (RBAC)
- ✅ Rate limiting on API endpoints
- ✅ CORS configuration
- ✅ Environment-based secrets
- ✅ Consent-based doctor access to patient data

## 🎨 UI Highlights

- **Calm, non-alarming design** with soft colors
- **Medical disclaimers** on every page
- **Responsive mobile-first** layout
- **Accessible** with ARIA labels
- **Smooth animations** and transitions
- **Custom Tailwind theme** matching PCOS branding

## 📝 To-Do / Roadmap

### As seen in task.md:
- [ ] Build cycle and symptom tracking forms
- [ ] Implement cycle prediction in frontend
- [ ] Create data visualization components (charts)
- [ ] Build Triage Navigator component
- [ ] Implement PDF generation service
- [ ] Add challenge and habit tracking UI
- [ ] Build doctor patient list and detail views
- [ ] Add educational myth-buster cards
- [ ] Implement doctor-moderated Q&A
- [ ] Privacy Shield Mode (future)

## 🧪 Testing (Future)

- Unit tests with Jest
- Integration tests for API routes
- React component tests with React Testing Library
- E2E tests with Playwright

## 🚢 Deployment

### Frontend
- Build: `npm run build`
- Preview: `npm run preview`
- Deploy to: Vercel, Netlify, or Cloudflare Pages

### Backend
- Deploy to: Railway, Render, or AWS
- Ensure PostgreSQL is properly configured
- Set production environment variables
- Enable HTTPS

## 📜 License

This is a health-tech prototype application. Please consult medical professionals for actual medical advice.

## 👥 Contributors

Built as a production-ready PCOS awareness platform.

---

**Remember**: This app does not diagnose. It supports early awareness and doctor consultation only.
# PCOS
