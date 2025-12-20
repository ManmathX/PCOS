# PCOS Frontend

React frontend for PCOS Early-Detection & Guidance App.

## Tech Stack
- React 19 + Vite
- Tailwind CSS (custom PCOS theme)
- React Router
- React Query
- Recharts for data visualization
- jsPDF for PDF generation

## Setup

```bash
npm install
cp .env.example .env
# Edit .env to point to backend
npm run dev
```

## Environment Variables

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

For production:
```env
VITE_API_URL=https://your-backend-url.com/api
```

## Features

### User Features
- Cycle tracking with predictions
- Symptom logging (12 types)
- PCOS risk assessment
- Habit tracking & challenges
- Appointment prep PDF export
- Educational content

### Doctor Features
- Patient list (consent-based)
- Risk monitoring
- Patient health history
- Clinical commenting

## Development

```bash
npm run dev      # Start dev server (port 5173)
npm run build    # Build for production
npm run preview  # Preview production build
```

## Theme

Custom Tailwind colors:
- Soft Pink: #FFB6C1
- Warm Beige: #F5E6D3
- Sage Green: #9CAF88

## Deployment

Deploy to Vercel or Netlify:
1. Connect Git repository
2. Set `VITE_API_URL` environment variable
3. Build command: `npm run build`
4. Output directory: `dist`

## Project Structure

```
src/
├── components/       # Reusable components
├── contexts/         # React contexts (Auth)
├── pages/           # Page components
│   ├── user/        # User dashboard pages
│   └── doctor/      # Doctor dashboard pages
└── services/        # API services, PDF generator
```
